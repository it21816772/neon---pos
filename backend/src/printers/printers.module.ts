import { Module } from '@nestjs/common';
import { PrintersController } from './printers.controller';
import { PrintersService } from './printers.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PrintersController],
  providers: [PrintersService],
  exports: [PrintersService],
})
export class PrintersModule {}

