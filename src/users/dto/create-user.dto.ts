export class CreateUserDto {
  constructor(nickname: string, email: string, password: string) {
    this.nickname = nickname;
    this.email = email;
    this.password = password;
  }

  nickname: string;
  email: string;
  password: string;
}
