import { Body, Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/by-email')
  async getUserByEmail(@Body('email') email: string) {
    return await this.usersService.findByEmail(email);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }
}
