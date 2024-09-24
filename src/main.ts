import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, ValidationPipe } from '@nestjs/common';
import { BearerTokenGuard } from './auth/guard/bearer-token.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,  // dto에서 default 값 허용
      transformOptions: {  // dto에서 타입에 맞게 request값이 변경됨
        enableImplicitConversion: true,
      },
      whitelist: true,  // DTO 프로퍼티 이외의 다른 것이 있으면 무시
      forbidNonWhitelisted: true,
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
