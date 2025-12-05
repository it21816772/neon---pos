import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReceiptsService } from './receipts.service';

@Controller('receipts')
@UseGuards(AuthGuard('jwt'))
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post('generate/:orderId')
  async generatePDF(@Param('orderId') orderId: string) {
    const filePath = await this.receiptsService.generatePDF(orderId);
    return { message: 'Receipt generated', filePath };
  }

  @Post('send-email/:orderId')
  async sendEmail(@Param('orderId') orderId: string) {
    await this.receiptsService.sendEmail(orderId);
    return { message: 'Email sent successfully' };
  }
}

