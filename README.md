# Tip

### module 생성

- service, controller, module 모두 생성

```jsx
nest g resource 
```

### Request Life Cycle

{{ Request }} → Middleware → Guard → Interceptor → Pipe → ( controller, service, repository ) → Exception Filter → Interceptor → {{ Response }}