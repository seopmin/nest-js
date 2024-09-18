import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { User } from '@prisma/client';
import { CurrentUser } from './current-user.decorator';
import { AccessTokenGuard, RefreshTokenGuard } from './guard/bearer-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  async loginEmail(
    @CurrentUser() user: User
  ) {
    return await this.authService.loginWithEmail(user);
  }

  @Post('register/email')
  async registerEmail(@Body() user: CreateUserDto) {
    return await this.authService.registerWithEmail(user);
  }

  @Post('token/reissue')
  @UseGuards(RefreshTokenGuard)
  async reissueToken(@Headers('authorization') auth: string) {
    const refreshToken = await this.authService.extractTokenFromHeader(
      auth,
      true,
    );

    return await this.authService.rotateToken(refreshToken);
  }
}
