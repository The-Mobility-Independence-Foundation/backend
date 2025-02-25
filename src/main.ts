import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ValidationException } from './common/exceptions/validation.exception';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        return new ValidationException(errors);
      },
    }),
  );

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('The Mobility Independence Foundation')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

<<<<<<< HEAD
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
=======
  app.useGlobalPipes(new ValidationPipe());
>>>>>>> feat: progress on inventory api

  await app.listen(configService.getOrThrow('PORT'));
}

bootstrap();
