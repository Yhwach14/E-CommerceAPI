import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ){}
  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesRepository.create({...createCategoryDto,})
    return this.categoriesRepository.save(category);
  }

  findAll() {
    return this.categoriesRepository.find({
      select:{
        id:true,
        name:true,
        isActive:true,
      }
    });
  }

  findOne(id: number) {
    return this.categoriesRepository.findOne({
      where:{id},
      select:{
        id:true,
        name:true,
        isActive:true,
      }
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findOne({where:{id}})
    
    if (!category) {
    throw new NotFoundException('Category not found');
  }
  await this.categoriesRepository.update(id,updateCategoryDto)
    return this.findOne(id);
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOne({where:{id},relations: { products: true }})

    if (!category){
      throw new NotFoundException('Category not found');
    }
    if(category.products.length > 0){
      throw new ConflictException("Can't delete a category that still in use")
    }
    return this.categoriesRepository.delete(id);
  }
}
