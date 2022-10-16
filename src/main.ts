import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return new UnprocessableEntityException(
          errors.map((error) => ({
            property: error.property,
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
