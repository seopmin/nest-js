import { IsEmail, IsString, Length } from 'class-validator';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';

export class CreateUserDto {
  constructor(nickname: string, email: string, password: string) {
    this.nickname = nickname;
    this.email = email;
    this.password = password;
  }

  @IsString({
    message: stringValidationMessage,
  })
  @Length(1, 20, {
    message: lengthValidationMessage,
  })
  nickname: string;

  @IsEmail({}, { message: emailValidationMessage })
  email: string;

  @IsString({
    message: stringValidationMessage,
  })
  @Length(3, 8, {
    message: lengthValidationMessage,
  })
  password: string;
}
