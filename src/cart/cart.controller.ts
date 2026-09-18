import { Controller, Post, Get, UseGuards, Patch, Param, Body, Req, Delete } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { AuthGuard } from '@nestjs/passport';
import { AddCartItemDto } from './dto/add-cart-item.dto.js';
import { UpdateCartDto } from './dto/update-cart-item.dto.js';


@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto:AddCartItemDto,@Req() req:any) {
    return this.cartService.addItem(req.user.id,dto.productId,dto.quantity);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req:any) {
    return this.cartService.getCart(req.user.id);
  }

  @Patch(':productId')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('productId') productId: string,@Body() dto:UpdateCartDto, @Req() req: any) {
    return this.cartService.updateItem(req.user.id, +productId,dto.quantity);
  }

  @Delete(':productId')
  @UseGuards(AuthGuard('jwt'))
  removeItem(@Param('productId' ) productId:string,@Req() req:any){
    return this.cartService.removeItem(req.user.id,+productId);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  clearCart(@Req() req:any){
    return this.cartService.clearCart(req.user.id)
  }
}
