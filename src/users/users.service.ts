import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: CreateUserDto): Promise<User> {
    return await this.prismaService.user.create({
      data: user,
    });
  }

  async getAllUser(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }
}
