import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrintersService } from './printers.service';

@Controller('printers')
@UseGuards(AuthGuard('jwt'))
export class PrintersController {
  constructor(private readonly printersService: PrintersService) {}

  @Get()
  findAll() {
    return this.printersService.findAll();
  }

  @Post('print/:orderId')
  async print(@Param('orderId') orderId: string) {
    const escpos = await this.printersService.generateESCPOS(orderId);
    return { escpos, message: 'Print data generated' };
  }
}

