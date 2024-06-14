import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { generateVerificationCode } from './utils';
import { EmailService } from '../email/email.service';
import { VerificationCode } from './verification-code.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectRepository(VerificationCode)
    private verificationCodeRepository: Repository<VerificationCode>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.validateUser(email, pass);
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(body: { email: string; password: string }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.usersService.findByEmail(
      body.email,
    );
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await this.usersService.validateUser(
      body.email,
      body.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { username: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async signUp(user: any) {
    const newUser = await this.usersService.create(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser;
    return result;
  }

  async sendVerificationEmail(email: string) {
    const code = generateVerificationCode();
    const verificationCode = this.verificationCodeRepository.create({
      email,
      code,
    });
    await this.verificationCodeRepository.save(verificationCode);
    await this.emailService.sendVerificationCode(email, code);
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      where: { email, code },
    });
    if (verificationCode) {
      await this.usersService.verifyUser(email);
      await this.verificationCodeRepository.remove(verificationCode);
      return true;
    }
    return false;
  }
}
