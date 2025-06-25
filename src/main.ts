import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { TransformInterceptor } from './utils/interceptors/transform.interceptor';
import { UnprocessableEntityInterceptor } from './utils/interceptors/unprocessable-entity.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new UnprocessableEntityInterceptor());

  app.use((_req, res, next) => {
    res.setHeader(
      'Permissions-Policy',
      'run-ad-auction=(), private-state-token-redemption=(), private-state-token-issuance=(), join-ad-interest-group=(), browsing-topics=()',
    );
    next();
  });

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
      transform: true
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
