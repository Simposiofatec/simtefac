/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import * as fs from 'fs'
import { join } from 'path';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(join(__dirname, '..', 'ssl', 'privkey.pem')),
    cert: fs.readFileSync(join(__dirname, '..', 'ssl', 'cert.pem')),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions
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
