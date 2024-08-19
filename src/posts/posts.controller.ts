import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { BasePostDto } from './dto/base-post.dto';

/**
 * author: string;
 * title: string;
 * content: string;
 * likeCount: number;
 * commentCount: number;
 */

let posts: BasePostDto[] = [
  {
    id: 1,
    author: '민섭',
    title: '나야나',
    content: '민섭 나야나',
    likeCount: 200,
    commentCount: 200,
  },
  {
    id: 2,
    author: '민섭',
    title: '나야나',
    content: '민섭 나야나',
    likeCount: 200,
    commentCount: 200,
  },
  {
    id: 3,
    author: '민섭',
    title: '나야나',
    content: '민섭 나야나',
    likeCount: 200,
    commentCount: 200,
  },
];

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts(): BasePostDto[] {
    return posts;
  }

  @Get(':id')
  getPost(@Query('id') postId: string): BasePostDto {
    const post = posts.find((post) => post.id === +postId);
    if (!post) throw new BadRequestException('존재하지 않는 id입니다.');
    return post;
  }

  @Post()
  postPost(@Body() post: BasePostDto): BasePostDto {
    const id = posts[posts.length - 1].id + 1;
    post.id = id;
    posts.push(post);
    return post;
  }

  @Patch(':id')
  patchPost(
    @Param('id') id: string,
    @Body() reqPost: BasePostDto,
  ): BasePostDto {
    const post = posts.find((post) => post.id === +id);

    if (!post) throw new BadRequestException('존재하지 않는 id입니다.');

    post.author = reqPost.author ?? post.author;
    post.title = reqPost.title ?? post.title;
    post.content = reqPost.content ?? post.content;

    posts = posts.map((prevPost) => (prevPost.id === +id ? post : prevPost));

    return post;
  }

  @Delete(':id')
  deletePost(@Param('id') id: string): string {
    const post = posts.find((post) => post.id === +id);
    if (!post) throw new BadRequestException('존재하지 않는 id입니다.');

    posts = posts.filter((post) => post.id !== +id);

    return id;
  }
}
