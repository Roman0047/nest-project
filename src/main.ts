import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return new UnprocessableEntityException(
          errors.map((error) => ({
            field: error.property,
            message:
              error.constraints[Object.keys(error.constraints).slice(-1)[0]],
            constraints: error.constraints,
          })),
          'Validation error',
        );
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
