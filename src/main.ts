import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { getHelmetConfig } from './config/helmet.config';
import { TransformInterceptor } from './utils/interceptors/transform.interceptor';
import { DomainErrorInterceptor } from './utils/interceptors/domain-error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  const config = new DocumentBuilder()
    .setTitle('Challenge NestJS API')
    .setDescription('API para gerenciamento de transações e estatísticas')
    .setVersion('1.0')
    .addTag('transactions', 'Operações relacionadas a transações')
    .addTag('statistics', 'Operações relacionadas a estatísticas')
    .addTag('health', 'Health check da aplicação')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

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
