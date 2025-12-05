import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PrintersService {
  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService,
  ) {}

  async findAll() {
    return this.prisma.printer.findMany({
      where: { isActive: true },
    });
  }

  async generateESCPOS(orderId: string): Promise<string> {
    const order = await this.ordersService.findOne(orderId);

    // ESC/POS commands
    let escpos = '\x1B\x40'; // Initialize printer
    escpos += '\x1B\x61\x01'; // Center align
    escpos += '\x1B\x21\x10'; // Double height
    escpos += 'POS SYSTEM\n';
    escpos += '\x1B\x21\x00'; // Normal size
    escpos += '\x1B\x61\x00'; // Left align
    escpos += '─'.repeat(32) + '\n';
    escpos += `Order #${order.id.slice(0, 8)}\n`;
    escpos += `Date: ${new Date(order.createdAt).toLocaleString()}\n`;
    escpos += '─'.repeat(32) + '\n';
    escpos += '\n';

    // Items
    order.items.forEach((item) => {
      const name = item.product.name.substring(0, 20);
      const qty = item.quantity;
      const price = (item.priceCents / 100).toFixed(2);
      const total = ((item.priceCents * item.quantity) / 100).toFixed(2);

      escpos += `${name}\n`;
      escpos += `  ${qty} x $${price} = $${total}\n`;
    });

    escpos += '\n';
    escpos += '─'.repeat(32) + '\n';
    escpos += '\x1B\x21\x10'; // Double height
    escpos += `TOTAL: $${(order.totalCents / 100).toFixed(2)}\n`;
    escpos += '\x1B\x21\x00'; // Normal size
    escpos += '\n';
    escpos += '\x1B\x61\x01'; // Center align
    escpos += 'Thank you!\n';
    escpos += '\n\n\n';
    escpos += '\x1D\x56\x00'; // Cut paper

    return escpos;
  }
}

