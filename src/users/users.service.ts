import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { ResUserDto } from './dto/res-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: CreateUserDto): Promise<User> {
    return await this.prismaService.user.create({
      data: user,
    });
  }

  async getAllUser(): Promise<ResUserDto[]> {
    return await this.prismaService.user.findMany({
      select: {
        nickname: true,
        email: true,
      }
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findFirst({
      where: { email },
    });
  }

  async getUserByNickname(nickname: string): Promise<User | null> {
    return await this.prismaService.user.findFirst({
      where: { nickname },
    });
  }
}
