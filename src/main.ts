import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { getHelmetConfig } from './config/helmet.config';
import { TransformInterceptor } from './utils/interceptors/transform.interceptor';
import { DomainErrorInterceptor } from './utils/interceptors/domain-error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  app.use(helmet(getHelmetConfig()));

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new DomainErrorInterceptor());

  app.enableCors({
    // TODO -> config provider
    origin: [],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
