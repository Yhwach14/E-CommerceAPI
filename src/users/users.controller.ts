import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { RolesGuard } from '../auth/guards/roles/roles.guard.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string,@Req() req:any) {
    const isOwner = req.user.id === +id;
    const isAdmin = req.user.role === Role.ADMIN;

    if (!isOwner && !isAdmin){
      throw new ForbiddenException('You can only access your own account');
    }

    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,@Req() req:any) {
    const isOwner = req.user.id === +id;
    const isAdmin = req.user.role === Role.ADMIN;

    if (!isOwner && !isAdmin){
      throw new ForbiddenException('You can only modify your own account');
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string,@Req() req:any) {
    const isOwner = req.user.id === +id;
    const isAdmin = req.user.role === Role.ADMIN;

    if (!isOwner && !isAdmin){
      throw new ForbiddenException('You can only delete your own account');
    }
    return this.usersService.remove(+id);
  }
}
