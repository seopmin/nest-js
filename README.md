# 21. Class-validator

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

### PickType 활용

- 해당 클래스에 있는 값을 선택해서 상속받을 수 있음

```jsx

// Pick, Omit, Partial -> Type 반환
// PickType, OmitType, PartialType -> 값 반환

export class CreatePostDto extends PickType(BasePostDto, [
  'title',
  'content',
]) {}

```

### PartialType 활용

- 부분적으로만 활용함. (BasePostDto에 있는 string 오류 메시지 같은 것들은 상속 받음)

```jsx
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsOptional()
  title?: string;

  @IsOptional()
  content?: string;
}

```

### Validation Message 일반화 하기

- validation 메시지를 일반화하여 통일된 형식으로 반환함.

```jsx
import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  /**
   * ValidationArguments의 프로퍼티들
   *
   * 1) value -> 검증되고 있는 값 (입력된 값)
   * 2) constraints -> 파라미터에 입력된 제한 사항들
   *    args.constraints[0] -> 1
   *    args.constraints[1] -> 20
   * 3) targetName -> 검증하고 있는 클래스 이름
   * 4) object -> 검증하고 있는 객체
   * 5) property -> 검증되고 있는 객체의 프로퍼티 이름
   */
  if (args.constraints.length === 2) {
    return `${args.property}은 ${args.constraints[0]}~${args.constraints[1]}글자로 입력해주세요.`;
  } else {
    return `${args.property}는 최소 ${args.constraints[0]} 글자를 입력해주세요.`;
  }
};

```

```jsx
// Dto
@Length(3, 8, {
	message: lengthValidationMessage,
})
```