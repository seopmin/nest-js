import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { decode } from 'punycode';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  /**
   * 기능 정리
   *
   * 1) registerWithEmail
   *    - email, nickname, password 를 입력받고 사용자 생성.
   *    - 생성 완료 -> accessToken과 refreshToken 반환
   *
   * 2) loginWithEmail
   *    - email, password를 입력하면 사용자 검증을 진행한다.
   *    - 검증이 완료되면 accessToken과 refreshToken 반환
   *
   * 3) loginUser
   *    - (1) 과 (2) 에서 필요한 accessToken 과 refreshToken 반환
   *
   * 4) signToken
   *    - (3) 에서 필요한 accessToken 과 refreshToken sign하는 로직
   *
   * 5) authenticateWithEmailAndPassword
   *    - (2)에서 로그인을 진행할 때 필요한 기본적인 검증 진행
   *      1. 사용자 존재 유무 확인 (email)
   *      2. 비밀번호 검증
   *      3. 통과? -> 사용자 정보 반환
   *      4. loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
   *
   */

  /**
   * Header로 부터 토큰을 받을 때
   *
   * {authorization: 'Basic {token}'}
   * {authorization: 'Bearer {token}'}
   */
  async extractTokenFromHeader(header: string, isBearer: Boolean = true) {
    const splitToken = header.split(' ');

    if (splitToken.length !== 2)
      throw new UnauthorizedException('알맞지 않은 Authorization 형식입니다.');

    const tokenType = splitToken[0];
    const token = splitToken[1];

    if (isBearer && tokenType !== 'Bearer')
      throw new UnauthorizedException('tokenType 은 Bearer 이어야 합니다.');
    else if (!isBearer && tokenType !== 'Basic')
      throw new UnauthorizedException('tokenType 은 Basic 이어야 합니다.');

    return token;
  }

  // base64 string 디코딩
  async decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf-8');

    const split = decoded.split(':');

    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
    }

    const email = split[0];
    const password = split[1];

    return {
      email,
      password,
    };
  }

  async registerWithEmail(user: CreateUserDto) {
    // 이메일 중복 검사
    let existingUser = await this.usersService.getUserByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('이미 존재하는 이메일입니다');
    }

    // 닉네임 중복 검사
    existingUser = await this.usersService.getUserByNickname(user.nickname);
    if (existingUser) {
      throw new BadRequestException('이미 존재하는 닉네임입니다');
    }

    // 비밀번호 해싱
    user.password = await bcrypt.hash(user.password, HASH_ROUNDS);

    // 사용자 생성
    const createUser = await this.usersService.createUser(user);

    // 로그인 처리
    return this.loginUser(createUser);
  }

  async loginWithEmail(user: Pick<User, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(existingUser);
  }

  loginUser(user: Pick<User, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  /**
   * payload 에 들어갈 정보
   *
   * 1) email
   * 2) sub -> id
   * 3) type : 'access' | 'refresh'
   *
   * {email: string, id: number}
   */
  signToken(user: Pick<User, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 3,
    });
  }

  /**
   * 1. 사용자 존재 유무 확인 (email)
   * 2. 비밀번호 검증
   * 3. 통과? -> 사용자 정보 반환
   */
  async authenticateWithEmailAndPassword(
    user: Pick<User, 'email' | 'password'>,
  ) {
    const existingUser = await this.usersService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자 입니다.');
    }

    /**
     * 파라미터
     *
     * 1) 입력된 비밀번호
     * 2) 기존 해서 -> 사용자 정보에 저장되어 있는 hash
     */
    const isOk = await bcrypt.compare(user.password, existingUser.password);

    if (!isOk) {
      throw new UnauthorizedException('비밀번호가 맞지 않습니다.');
    }

    return existingUser;
  }

  async rotateToken(token: string) {
    const decoded = this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });

    /**
     * sub: id
     * email: email
     * type: 'access' | 'refresh'
     */
    if (decoded.type !== 'refresh')
      throw new UnauthorizedException(
        '토큰 재발급은 Refresh 토큰으로만 가능합니다!',
      );

    return {
      accessToken: this.signToken({...decoded}, false),
      refreshToken: this.signToken({...decoded}, true),
    };
  }

  // 토큰 검증
  async verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });
  }
}
