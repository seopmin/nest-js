# 5. DI & IoC

![ioc_container.png](5%20DI%20&%20IoC%206fdf2c54b1fc4dbf8738013af4e8130f/ioc_container.png)

### Provider로 주입.

- `PostsService` 를 사용하기 위해서는 provider에 주입해야함.
    
    ```jsx
    @Module({
      controllers: [PostsController],
      providers: [PostsService],
    })
    export class PostsModule {}
    ```
    

### Injectable 데코레이터

- `@Injectable()` 를 붙이게 되면 IoC Container에 주입

```jsx
@Injectable()
export class PostsService {}
```

### Import

: the list of imported modules that export the providers which are required in this module

```jsx
@Module({
  imports: [PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
```