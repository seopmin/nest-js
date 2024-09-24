import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BasePaginationDto } from './dto/base-pagination.dto';

@Injectable()
export class CommonService {
  constructor(private readonly prismaService: PrismaService) {}

  paginate<T>(dto: BasePaginationDto, path: string) {
    if (dto.page) {
      return this.pagePagenate(dto, path);
    } else {
      return this.cursorPaginate(dto, path);
    }
  }

  private async pagePagenate<T>(dto: BasePaginationDto, path: string) {}

  private async cursorPaginate<T>(dto: BasePaginationDto, path: string) {}

  /**
   * DTO의 현재 생긴 구조
   * {
   *    where__id__more_than: 1,
   *    order__createdAt: 'asc'
   * }
   *
   * where 필터를 자동으로 파싱
   *
   * 1) where로 시작하면 필터 적용
   * 2) order로 시작하면 정렬 로직
   * 3) 필터 로직을 적용할 경우 '__" 기준으로 split 했을 때
   *    3개의 값으로 나뉘는지 2개의 값으로 나뉘는지 확인
   *    3-1) ㄷ개의 값으로 나뉜다면 FILTER_MAPPER에 해당하는 orperator 함수를 찾아서 적용
   *      ['where', 'id', 'more_than']
   *    3-2) 2개의 값으로 나뉜다면 정확한 값을 필터하는 것이기 때문에 operator 없이 적용
   *      where_id
   *      ['where', 'id']
   * 4) order의 경우 3-2와 같이 적용
   */
}
