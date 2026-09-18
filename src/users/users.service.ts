import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userRepository.save(
      this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      }),
    );
    const { password, ...safeUser } = user;
    return safeUser;
  }

  findAll() {
    return this.userRepository.find({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        password:false
      },
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        password:false
      },
    });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateData = { ...updateUserDto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
