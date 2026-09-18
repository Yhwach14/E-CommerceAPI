import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto.js';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}
    
    @Post('register')
    register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.firstName, dto.lastName);
}

    @Post('login')
    login(@Body() loginDto : LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
    }
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@Req() req: Request) {
        return req.user;
    }
}
