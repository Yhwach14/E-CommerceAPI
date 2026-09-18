import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { CartItem } from '../cart/entities/cart-item.entity.js';
import { Product } from '../products/entities/product.entity.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}
  findUserOrders(userId: number) {
    return this.ordersRepo.find({
      where: { user: { id: userId } },
      relations: { items: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepo.findOne({
      where: { id },
      relations: { items: true, user: true },
      select: { user: { id: true, email: true, role: true } },
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async checkout(userId: number): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      //#1 read the user's cart
      const cartItems = await manager.find(CartItem, {
        where: { user: { id: userId } },
        relations: { product: true },
      });

      if (cartItems.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      //#2 verify every item still has enough stock
      for (const cartItem of cartItems) {
        if (cartItem.product.stockQuantity < cartItem.quantity) {
          throw new ConflictException(
            `Insufficient stock for ${cartItem.product.sku}`,
          );
        }
      }

      //#3 build one OrderItem per cart item
      const orderItems = cartItems.map((cartItem) =>
        manager.create(OrderItem, {
          product: { id: cartItem.product.id },
          productName: cartItem.product.name,
          sku: cartItem.product.sku,
          unitPrice: cartItem.product.price,
          quantity: cartItem.quantity,
        }),
      );

      //#4 total is derived from the snapshotted prices above
      const totalAmount = orderItems.reduce(
        (sum, item) => sum + Number(item.unitPrice) * item.quantity,
        0,
      );

      //#5 create the Order itself
      const order = await manager.save(Order, {
        user: { id: userId },
        status: OrderStatus.PENDING,
        totalAmount,
        items: orderItems,
      });

      //#6 reduce stock for each product by the quantity that was just ordered
      for (const cartItem of cartItems) {
        await manager.decrement(
          Product,
          { id: cartItem.product.id },
          'stockQuantity',
          cartItem.quantity,
        );
      }

      //#7 the cart has been 'converted' into an order, so empty it.
      await manager.delete(CartItem, { user: { id: userId } });

      return order;
    });
  }
}
