import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const rawToken = req.headers['authorization'];
    if (!rawToken) throw new UnauthorizedException('토큰이 존재하지 않습니다.');

    const token = await this.authService.extractTokenFromHeader(rawToken, true);

    let payload: any;
    try {
      payload = await this.authService.verifyToken(token);
    } catch {
      throw new UnauthorizedException('만료된 토큰입니다.');
    }
    
    const user = await this.usersService.getUserByEmail(payload.email);

    req.token = token;
    req.tokenType = payload.type;
    req.user = user;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.tokenType !== 'access') {
      throw new UnauthorizedException('accessToken 이 아닙니다.');
    }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log(context);
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.tokenType !== 'refresh')
      throw new UnauthorizedException('refreshToken 이 아닙니다.');

    return true;
  }
}
