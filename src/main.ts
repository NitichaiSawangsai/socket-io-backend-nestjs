import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './socket-io-adapter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigService);
  const port = 3000;

  // app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

  await app.listen(port);
}
bootstrap();
