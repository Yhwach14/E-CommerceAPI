import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { AuthGuard } from '@nestjs/passport';
import { Order } from './entities/order.entity.js';
import { Role } from '../common/enums/role.enum.js';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@Req() req: { user: { id: number } }) {
    return this.ordersService.checkout(req.user.id);
  }

  @Get()
  findMine(@Req() req: { user: { id: number } }) {
    return this.ordersService.findUserOrders(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Req() req: { user: { id: number; role: string } },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Order> {
    const order = await this.ordersService.findOne(id);

    const isOwner = req.user.id === order.user.id;
    const isAdmin = req.user.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can only view your own orders');
    }

    return order;
  }
}
