import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // adding cookie session middleware
  app.use(cookieSession({
    keys: ['owkeoijcmawj'], // random characters TODO: find a better solution
  }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  // strips validated object (removes extra attributes)
    }),
  );

  await app.listen(3000);
}
bootstrap();
