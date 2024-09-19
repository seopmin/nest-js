import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  AccessTokenGuard,
} from 'src/auth/guard/bearer-token.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from '@prisma/client';

@UseGuards(AccessTokenGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) postId: number) {
    return this.postsService.getPostById(postId);
  }

  @Post()
  async postPost(@CurrentUser() user: User, @Body() post: CreatePostDto) {
    return await this.postsService.createPost(user, post);
  }

  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() reqPost: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, reqPost);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
