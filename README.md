# 15.Pipe

Pipes have two typical use cases:

- **transformation**: transform input data to the desired form (e.g., from string to integer)
- **validation**: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception

### Pipe를 통해 변형 및 유효성 검사도 진행

```jsx
@Get(':id')
getPost(@Param('id', ParseIntPipe) postId: number) {
  return this.postsService.getPostById(postId);
}
```

### main.ts에 해당 코드 추가

```jsx
app.useGlobalPipes(new ValidationPipe());
```

### class validate

```jsx
export class CreateUserDto {
  constructor(nickname: string, email: string, password: string) {
    this.nickname = nickname;
    this.email = email;
    this.password = password;
  }

  @IsString()
  nickname: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 8, {
    message: '비밀번호는 최소 8자 이상이어야 합니다.',
  })
  password: string;
}

```

### need to install

```tsx
npm install class-validator
npm install class-transformer
```

### class-validator

: 검증 기능을 가지고 있는 클래스

### DTO

: Data Transfer Object

```tsx
export class PostDto {
  @IsNumber()  // validate
  authorId: number

  @IsString()
  title: string

  // @IsString()
  // author: string

  @IsString()
  content: string

  @IsOptional()
  @IsNumber()
  likeCount?: number

  @IsOptional()
  @IsNumber()
  commentCount?: number
}
```

### 앱 전반적으로 validation 추가

```tsx
// main.ts
app.useGlobalPipes(new ValidationPipe());

```

### response 메시지 바꾸기

```tsx
@IsString({
    message: 'title은 string 값으로 입력해주세요.',
  })
```