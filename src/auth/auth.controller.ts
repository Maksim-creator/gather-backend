import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.repeatPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    return this.authService.signUp(createUserDto);
  }
}
