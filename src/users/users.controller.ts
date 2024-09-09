import { Body, Controller, Post, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async postUser(@Body() user: CreateUserDto) {
    return await this.usersService.createUser(user);
  }

  @Get()
  async getUsers() {
    return await this.usersService.getAllUser();
  }
}
