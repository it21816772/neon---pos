import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, PaymentMethod } from './dto/create-order.dto';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { items, customerEmail } = createOrderDto;

    // Validate items and calculate total
    let subtotalCents = 0;
    const productIds = items.map((item) => item.productId);

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { inventory: true },
    });

    // Validate products exist and check inventory
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      const inventory = product.inventory;
      if (!inventory || inventory.quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient inventory for product ${product.name}`,
        );
      }

      subtotalCents += product.priceCents * item.quantity;
    }

    const taxCents = Math.round(subtotalCents * 0.075);
    const totalCents = subtotalCents + taxCents;
    const paymentMethod = createOrderDto.paymentMethod ?? PaymentMethod.CASH;

    // Create order with transaction
    return this.prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          userId,
          subtotalCents,
          taxCents,
          discountCents: 0,
          totalCents,
          status: 'COMPLETED',
          customerEmail,
          paymentMethod,
          items: {
            create: items.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              return {
                productId: item.productId,
                quantity: item.quantity,
                priceCents: product!.priceCents,
                subtotalCents: product!.priceCents * item.quantity,
              };
            }),
          },
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      // Update inventory for each item
      for (const item of items) {
        await this.inventoryService.decreaseQuantity(
          item.productId,
          item.quantity,
          tx,
        );
      }

      return order;
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        receipts: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }
}

