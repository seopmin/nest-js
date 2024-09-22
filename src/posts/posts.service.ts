import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePostDto } from './dto/base-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post, User } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { HTTP_HOST, PROTOCOL } from 'src/common/const/env.const';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllPosts(): Promise<Post[]> {
    return this.prismaService.post.findMany();
  }

  async paginatePosts(dto: PaginatePostDto) {
    const key = dto.where__id_more_than ? {
      gt: dto.where__id_more_than ?? 0,
    } : {
      lt: dto.where__id_less_than ?? 0,
    }

    const posts = await this.prismaService.post.findMany({
      where: {
        id: key,
      },
      orderBy: {
        createdAt: dto.order_createdAt,
      },
      take: dto.take,
    });

    const lastPostItemId =
      posts.length - 1 >= 0
        ? posts[posts.length - 1].id
        : dto.where__id_more_than;

    const nextUrl =
      posts.length === dto.take
        ? `${PROTOCOL}://${HTTP_HOST}/posts?where__id_more_than=${lastPostItemId}`
        : null;
    /**
     * < Response >
     * data: []
     * cursor: {
     *  after: 마지막 데이터의 id
     * }
     * count: 응답 데이터의 개수
     * next: 다음 데이터를 사용할 때의 url
     */

    return {
      data: posts,
      cursor: {
        after: lastPostItemId,
      },
      count: posts.length,
      next: nextUrl,
    };
  }

  async generatePosts(userId: number) {
    const user: Pick<User, 'id'> = { id: userId };

    for (let i = 0; i < 100; i++) {
      await this.createPost(user, {
        title: `임의로 생성한 title - ${i}`,
        content: `임의로 생성한 content - ${i}`,
      });
    }
    return { userId };
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.prismaService.post.findFirst({
      where: { id },
    });

    if (!post) throw new BadRequestException('존재하지 않는 post입니다.');

    return post;
  }

  async createPost(user: Pick<User, 'id'>, post: CreatePostDto): Promise<Post> {
    const author = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });

    if (!author) throw new BadRequestException('존재하지 않는 작가입니다.');

    return await this.prismaService.post.create({
      data: {
        authorId: user.id,
        ...post,
      },
    });
  }

  async updatePost(id: number, updatePost: UpdatePostDto): Promise<Post> {
    const post = await this.prismaService.post.findFirst({ where: { id } });

    if (!post) throw new BadRequestException('존재하지 않는 id입니다.');

    return await this.prismaService.post.update({
      where: {
        id,
      },
      data: {
        ...updatePost,
      },
    });
  }

  async deletePost(id: number) {
    const post = await this.prismaService.post.findFirst({ where: { id } });

    if (!post) throw new BadRequestException('존재하지 않는 id입니다.');

    return await this.prismaService.post.delete({ where: { id } });
  }
}
