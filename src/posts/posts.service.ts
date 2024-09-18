import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePostDto } from './dto/base-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from '@prisma/client';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllPosts(): Promise<Post[]> {
    return this.prismaService.post.findMany();
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.prismaService.post.findFirst({
      where: { id },
    });

    if (!post) throw new BadRequestException('존재하지 않는 post입니다.');

    return post;
  }

  async createPost(post: CreatePostDto): Promise<Post> {
    const author = await this.prismaService.user.findUnique({
      where: { id: post.authorId },
    });

    if (!author) throw new BadRequestException('존재하지 않는 작가입니다.');

    return await this.prismaService.post.create({
      data: {
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
