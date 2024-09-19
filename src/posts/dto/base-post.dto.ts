import { IsString } from 'class-validator';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';

export class BasePostDto {
  id: number;
  author: string;

  @IsString({
    message: stringValidationMessage,
  })
  title: string;

  @IsString({
    message: stringValidationMessage,
  })
  content: string;
  likeCount?: number;
  commentCount?: number;
}
