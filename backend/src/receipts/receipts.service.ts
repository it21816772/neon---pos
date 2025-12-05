import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ReceiptsService {
  private transporter: nodemailer.Transporter;

  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
    private configService: ConfigService,
  ) {
    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async generatePDF(orderId: string): Promise<string> {
    const order = await this.ordersService.findOne(orderId);

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    // Create PDF - Standard receipt size (80mm width, dynamic height)
    const doc = new PDFDocument({ 
      size: [226.77, 800], // 80mm width in points (80 * 2.83465), approximate height
      margins: { top: 20, bottom: 20, left: 15, right: 15 }
    });
    const fileName = `receipt-${orderId}-${Date.now()}.pdf`;
    const filePath = path.join(process.cwd(), 'uploads', 'receipts', fileName);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(20).text('POS SYSTEM', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Order #${order.id.slice(0, 8)}`, { align: 'center' });
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, { align: 'center' });
    doc.moveDown();

    // Items
    doc.fontSize(14).text('ITEMS', { underline: true });
    doc.moveDown(0.5);

    let total = 0;
    order.items.forEach((item) => {
      const itemTotal = (item.priceCents * item.quantity) / 100;
      total += itemTotal;

      doc.fontSize(10);
      doc.text(`${item.product.name}`, { continued: false });
      doc.text(`Qty: ${item.quantity} x $${(item.priceCents / 100).toFixed(2)}`, {
        align: 'right',
      });
      doc.text(`$${itemTotal.toFixed(2)}`, { align: 'right' });
      doc.moveDown(0.3);
    });

    doc.moveDown();
    doc.fontSize(12);
    doc.text('─'.repeat(40));
    doc.moveDown(0.5);
    doc.fontSize(16).text(`TOTAL: $${(order.totalCents / 100).toFixed(2)}`, {
      align: 'right',
      bold: true,
    });

    doc.moveDown(2);
    doc.fontSize(10).text('Thank you for your purchase!', { align: 'center' });

    doc.end();

    // Wait for PDF to be written
    await new Promise<void>((resolve, reject) => {
      // Wrap resolve to match the expected callback signature for the stream
      // 'finish' event which doesn't pass any arguments.
      stream.on('finish', () => resolve());
      stream.on('error', reject);
    });

    // Save receipt record
    const receipt = await this.prisma.receipt.create({
      data: {
        orderId,
        pdfUrl: `/receipts/${fileName}`,
      },
    });

    return filePath;
  }

  async sendEmail(orderId: string): Promise<void> {
    const order = await this.ordersService.findOne(orderId);

    if (!order || !order.customerEmail) {
      throw new NotFoundException('Order or customer email not found');
    }

    // Generate PDF if not exists
    let receipt = await this.prisma.receipt.findFirst({
      where: { orderId },
    });

    if (!receipt) {
      await this.generatePDF(orderId);
      receipt = await this.prisma.receipt.findFirst({
        where: { orderId },
      });
    }

    if (!receipt || !receipt.pdfUrl) {
      throw new NotFoundException('Receipt PDF not found');
    }

    const pdfPath = path.join(process.cwd(), 'uploads', 'receipts', path.basename(receipt.pdfUrl));

    // Send email
    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to: order.customerEmail,
      subject: `Receipt for Order #${order.id.slice(0, 8)}`,
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Your receipt is attached.</p>
        <p><strong>Order #${order.id.slice(0, 8)}</strong></p>
        <p><strong>Total: $${(order.totalCents / 100).toFixed(2)}</strong></p>
      `,
      attachments: [
        {
          filename: `receipt-${order.id.slice(0, 8)}.pdf`,
          path: pdfPath,
        },
      ],
    });

    // Update receipt
    await this.prisma.receipt.update({
      where: { id: receipt.id },
      data: { emailSent: true },
    });
  }
}

