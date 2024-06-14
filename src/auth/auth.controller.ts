import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
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
    return this.authService.signUp({ ...createUserDto, verified: false });
  }

  @Post('send-verification-email')
  async sendVerificationEmail(@Body('email') email: string) {
    await this.authService.sendVerificationEmail(email);
  }

  @Post('verify-code')
  async verifyCode(@Body('email') email: string, @Body('code') code: string) {
    const isValid = await this.authService.verifyCode(email, code);
    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    } else {
      return { verified: isValid };
    }
  }
}
