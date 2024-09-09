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
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPost(@Param('id') postId: number) {
    return this.postsService.getPostById(+postId);
  }

  @Post()
  async postPost(@Body() post: CreatePostDto) {
    return await this.postsService.createPost(post);
  }

  @Patch(':id')
  patchPost(
    @Param('id') id: number,
    @Body() reqPost: UpdatePostDto,
  ) {
    return this.postsService.updatePost(+id, reqPost);
  }

  @Delete(':id')
  deletePost(@Param('id') id: number) {
    return this.postsService.deletePost(+id);
  }
}
