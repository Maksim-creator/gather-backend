import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      throw new ConflictException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validateUser(
      body.email,
      body.password,
    );
    if (!isPasswordValid) {
      throw new ConflictException('Invalid credentials');
    }

    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(user: any) {
    const newUser = await this.usersService.create(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser;
    return result;
  }
}
