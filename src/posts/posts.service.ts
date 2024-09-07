import { BadRequestException, Injectable } from '@nestjs/common';
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

@Injectable()
export class PostsService {
  getAllPosts(): BasePostDto[] {
    return posts;
  }

  getPostById(id: string): BasePostDto {
    const post = posts.find((post) => post.id === +id);
    if (!post) throw new BadRequestException('존재하지 않는 id입니다.');
    return post;
  }

  createPost(post: BasePostDto): BasePostDto {
    const id = posts[posts.length - 1].id + 1;
    post.id = id;
    posts.push(post);
    return post;
  }

  updatePost(id: string, reqPost: BasePostDto): BasePostDto {
    const post = posts.find((post) => post.id === +id);

    if (!post) throw new BadRequestException('존재하지 않는 id입니다.');

    post.author = reqPost.author ?? post.author;
    post.title = reqPost.title ?? post.title;
    post.content = reqPost.content ?? post.content;

    posts = posts.map((prevPost) => (prevPost.id === +id ? post : prevPost));

    return post;
  }

  deletePost(id: number) {
    const post = posts.find((post) => post.id === id);
    if (!post) throw new BadRequestException('존재하지 않는 id입니다.');

    posts = posts.filter((post) => post.id !== id);

    return id;
  }
}
