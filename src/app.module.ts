import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './error';
import {
  AccessTokenGuard,
  BearerTokenGuard,
  RefreshTokenGuard,
} from './auth/guard/bearer-token.guard';
import { CommonModule } from './common/common.module';

@Module({
  imports: [AuthModule, UsersModule, PostsModule, PrismaModule, CommonModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
