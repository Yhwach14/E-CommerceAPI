import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}
  create(createProductDto: CreateProductDto) {
    const { categoryId, ...productData } = createProductDto;

    const product = this.productsRepository.create({
      ...productData,
      category: {
        id: categoryId,
      },
    });
    return this.productsRepository.save(product);
  }

  findAll() {
    return this.productsRepository.find({
      relations: { category: true },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        isActive: true,
        description: true,
        imageUrl: true,
      },
    });
  }

  findOne(id: number) {
    return this.productsRepository.findOne({
      where: { id },
      relations: { category: true },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        isActive: true,
        description: true,
        imageUrl: true,
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const { categoryId, ...productData } = updateProductDto;
    await this.productsRepository.update(id, {
      ...productData,
      ...(categoryId !== undefined && { category: { id: categoryId } }),
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.productsRepository.delete(id);
  }
}
