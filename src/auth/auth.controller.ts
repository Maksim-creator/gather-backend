import { Controller, Post, UseGuards, Body, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import { AuthGuard } from './jwt-auth.guard';

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
    return this.authService.signUp({ ...createUserDto, verified: false });
  }

  @UseGuards(AuthGuard)
  @Post('send-verification-email')
  async sendVerificationEmail(@Req() req) {
    const email = req.user.email;
    await this.authService.sendVerificationEmail(email);
  }

  @UseGuards(AuthGuard)
  @Post('verify-code')
  async verifyCode(@Req() req, @Body('code') code: string) {
    const email = req.user.email;
    const isValid = await this.authService.verifyCode(email, code);
    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    } else {
      return { verified: isValid };
    }
  }
}
