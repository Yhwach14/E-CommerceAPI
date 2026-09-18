import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity.js';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity.js';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartItem)
        private cartRepository: Repository<CartItem>,
        @InjectRepository(Product)
        private productsRepository: Repository<Product>
    ){}

    async getCart(userId: number) {
        return this.cartRepository.find({
            where: { user: { id: userId } },
            relations: { product: true },
        });
    }

    async addItem(
        userId: number,
        productId: number,
        quantity: number,
    ) {
        if (quantity < 1) {
            throw new BadRequestException('Quantity must be at least 1');
        }

        const product = await this.productsRepository.findOne({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        const existingItem = await this.cartRepository.findOne({
            where: {
                user: { id: userId },
                product: { id: productId },
            },
        });

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            if (product.stockQuantity < newQuantity) {
                throw new BadRequestException('Not enough stock available');
            }

            existingItem.quantity = newQuantity;
            return this.cartRepository.save(existingItem);
        }

        if (product.stockQuantity < quantity) {
            throw new BadRequestException('Not enough stock available');
        }

        const cartItem = this.cartRepository.create({
            user: { id: userId },
            product: { id: productId },
            quantity,
        });
        return this.cartRepository.save(cartItem);
    }

    async updateItem(
        userId: number,
        productId: number,
        quantity: number,
    ) {
        if (quantity < 1) {
            throw new BadRequestException('Quantity must be at least 1');
        }

        const cartItem = await this.cartRepository.findOne({
            where: {
                user: { id: userId },
                product: { id: productId },
            },
            relations: { product: true },
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        if (cartItem.product.stockQuantity < quantity) {
            throw new BadRequestException('Not enough stock available');
        }

        cartItem.quantity = quantity;
        return this.cartRepository.save(cartItem);
    }

    async removeItem(
        userId: number,
        productId: number,
    ) {
        const cartItem = await this.cartRepository.findOne({
            where: {
                user: { id: userId },
                product: { id: productId },
            },
        });

        if (!cartItem) {
            throw new NotFoundException('Cart item not found');
        }

        await this.cartRepository.remove(cartItem);

        return {
            message: 'Item removed from cart',
        };
    }

    async clearCart(userId: number) {
        await this.cartRepository.delete({
            user: { id: userId },
        });

        return {
            message: 'Cart cleared',
        };
    }
}