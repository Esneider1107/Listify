import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

      app.enableCors({
      origin: [
        'https://frontlistifyyyy.vercel.app',
        /\.vercel\.app$/
      ],
      credentials: true,
    });

  await app.listen(3000, '0.0.0.0');
}

bootstrap();

