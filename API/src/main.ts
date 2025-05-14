/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import * as fs from 'fs'
import { join } from 'path';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
  });

  app.enableCors({
    exposedHeaders: '*',
    allowedHeaders: '*',
    origin: '*'
});
  
  await app.listen(8080);
}

require('dotenv').config();

bootstrap();
