import { Module } from '@nestjs/common';
import { LoggerModule } from './utils/logger';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({}),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
