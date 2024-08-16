# Controller

```jsx
@Controller('post')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('post')
  getPost(): Post {
    return {
      author: '곽민섭',
      title: '민섭',
      content: '나다나',
      likeCount: 1234,
      commentCount: 12341234,
    };
  }
}
```

@Controller() 에 path 추가

- 해당 클래스의 전체적으로 path 추가

@Get() 에 path 추가

- 해당 메서드에만 path 추가

Q. getPost() 메서드가 실행되려면?

A. `/post/post`  호출