import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { storageConfig } from 'config/storage.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(storageConfig.photo.destination,{  
      prefix:storageConfig.photo.urlPrefix,
      maxAge:storageConfig.photo.maxAge,
      index:false,
  })

  await app.listen(3000);
  
}
bootstrap();