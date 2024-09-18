import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        // 각 필드의 오류 메시지 가져오기
        const messages = errors.flatMap((error) => {
          return Object.values(error.constraints);
        });

        return new HttpException(
          `BadRequest (failed in pipe) : <<< ${messages.join(' && ')} >>>`,
          400,
        );
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
