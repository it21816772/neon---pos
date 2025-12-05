import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.inventory.findMany({
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async findOne(productId: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
      include: {
        product: true,
      },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory for product ${productId} not found`);
    }

    return inventory;
  }

  async update(productId: string, updateInventoryDto: UpdateInventoryDto) {
    await this.findOne(productId);

    return this.prisma.inventory.update({
      where: { productId },
      data: updateInventoryDto,
      include: {
        product: true,
      },
    });
  }

  async decreaseQuantity(
    productId: string,
    quantity: number,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prisma;

    const inventory = await prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory for product ${productId} not found`);
    }

    if (inventory.quantity < quantity) {
      throw new BadRequestException('Insufficient inventory');
    }

    return prisma.inventory.update({
      where: { productId },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });
  }
}

