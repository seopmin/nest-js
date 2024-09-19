import { PickType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { BasePostDto } from './base-post.dto';

// Pick, Omit, Partial -> Type 반환
// PickType, OmitType, PartialType -> 값 반환

export class CreatePostDto extends PickType(BasePostDto, [
  'title',
  'content',
]) {}
