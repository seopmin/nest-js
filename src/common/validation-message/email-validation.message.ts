import { ValidationArguments } from 'class-validator';

export const emailValidationMessage = (args: ValidationArguments) => {
  return `${args.property}을 이메일 형식으로 입력해주세요.`;
};
