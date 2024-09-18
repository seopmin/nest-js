import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  constructor(nickname: string, email: string, password: string) {
    this.nickname = nickname;
    this.email = email;
    this.password = password;
  }

  @IsString()
  nickname: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 8, {
    message: '비밀번호는 최소 8자 이상이어야 합니다.',
  })
  password: string;
}
