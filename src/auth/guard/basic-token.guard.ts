import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
/**
 * 구현할 기능
 *
 * 1) 요청객체 (request)를 불러오고
 *    authorization header 로부터 토큰을 가져옴.
 * 2) authService.extractTokenFromHeader 를 이용해
 *    사용할 수 있는 형태의 토큰을 추출한다.
 * 3) authService.decodedBasicToken을 실행하여
 *    email과 password를 추출
 * 4) email과 password를 이용하여 사용자를 가져옴.
 *    authService.authenticateWithEmailAndPassword
 * 5) 찾아낸 사용자를 (1) 요청 객체에 붙여준다.
 *    req.uesr = user;
 */

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    // console.log(req);
    const rawToken = req.headers['authorization'];

    if (!rawToken) {
      throw new UnauthorizedException('토큰이 존재하지 않습니다.');
    }

    const token = await this.authService.extractTokenFromHeader(
      rawToken,
      false,
    );

    const { email, password } = await this.authService.decodeBasicToken(token);

    const user = await this.authService.authenticateWithEmailAndPassword({
      email,
      password,
    });

    req.user = user;

    return true;
  }
}
