import { PartialType } from '@nestjs/swagger';
import { AddCartItemDto } from './add-cart-item.dto.js';
import { IsInt, Min } from 'class-validator';

export class UpdateCartDto {
    @IsInt()
    @Min(1)
    quantity: number
}