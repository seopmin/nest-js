# 19. CustomDecorator

### 데코레이터를 통해 request에서 원하는 값을 가지고 올 수 있고, 가공할 수 있음

```jsx
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

```jsx
@Get()
async findOne(@User() user: UserEntity) {
  console.log(user);
}

```

### **Passing data**

```jsx
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
```

```jsx
@Get()
async findOne(@User('firstName') firstName: string) {
  console.log(`Hello ${firstName}`);
}
```