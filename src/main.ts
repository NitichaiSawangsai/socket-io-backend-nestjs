import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigType } from '@nestjs/config';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import serverConfig from './config/server.config';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('New Contact Center storage API')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const svConfig: ConfigType<typeof serverConfig> = app.get(serverConfig.KEY);
  app.use('/docs', function (_req, res, next) {
    if (['production', 'prod'].includes(svConfig.nodeENV)) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    next();
  });
  SwaggerModule.setup('docs', app, document);
  fs.writeFileSync('swagger.json', JSON.stringify(document));
  // app.useLogger(app.get<WinstonLoggerService>(LOGGER_SERVICE));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Enable automatic transformation
      whitelist: true, // Automatically remove properties that are not in the DTO class
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are found
    }),
  );

  await app.listen(svConfig.port);
}
bootstrap();
