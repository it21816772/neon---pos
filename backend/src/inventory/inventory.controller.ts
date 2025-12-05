import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':productId')
  findOne(@Param('productId') productId: string) {
    return this.inventoryService.findOne(productId);
  }

  @Patch(':productId')
  @UseGuards(RolesGuard)
  @Roles('MANAGER')
  update(
    @Param('productId') productId: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(productId, updateInventoryDto);
  }
}

