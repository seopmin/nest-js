import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginatePostDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  // 마지막 데이터의 아이디
  @IsNumber()
  @IsOptional()
  where__id_more_than?: number;

  @IsNumber()
  @IsOptional()
  where__id_less_than?: number;

  // 정렬
  @IsIn(['asc', 'desc']) // 이 안에 있는 값만 허용됨
  @IsOptional()
  order_createdAt: 'asc' | 'desc' = 'asc';

  // 응답 받을 데이터 개수
  @IsNumber()
  @IsOptional()
  take: number = 20;
}
