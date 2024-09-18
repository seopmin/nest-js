import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  async loginEmail(
    @Headers('authorization') auth: string,
  ) {
    const token = await this.authService.extractTokenFromHeader(auth, false);

    const credentials = await this.authService.decodeBasicToken(token);

    return await this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  async registerEmail(@Body() user: CreateUserDto) {
    return await this.authService.registerWithEmail(user);
  }

  @Post('token/reissue')
  async reissueToken(@Headers('authorization') auth: string) {
    const refreshToken = await this.authService.extractTokenFromHeader(
      auth,
      true,
    );

    return await this.authService.rotateToken(refreshToken);
  }
}
