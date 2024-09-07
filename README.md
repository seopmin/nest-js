# 4.Service

### service 의 역할

: 로직들의 코드를 작성하는 공간

### Tip

```jsx
constructor(private readonly c: C) 

// 위와 동일한 코드

export class A {
	c: C;
	
	constructor(c: C) {
		this.c = c;
	}
}
```