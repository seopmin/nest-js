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

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts(): BasePostDto[] {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPost(@Query('id') postId: string): BasePostDto {
    return this.postsService.getPostById(postId);
  }

  @Post()
  postPost(@Body() post: BasePostDto): BasePostDto {
    return this.postsService.createPost(post);
  }

  @Patch(':id')
  patchPost(
    @Param('id') id: string,
    @Body() reqPost: BasePostDto,
  ): BasePostDto {
    return this.postsService.updatePost(id, reqPost);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
