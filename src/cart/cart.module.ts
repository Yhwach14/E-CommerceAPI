import { Module } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { CartController } from './cart.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Product } from '../products/entities/product.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Product, User])],
  exports:[],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
