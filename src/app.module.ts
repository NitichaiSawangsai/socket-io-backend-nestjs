import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CallSummarizationModule } from './call-summarization/call-summarization.module';
import serverConfig from './config/server.config';
import * as Joi from 'joi';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [serverConfig],
      cache: true,
      validationSchema: Joi.object({
        SERVER_PORT: Joi.number().port().label('port server').required(),
        NODE_ENV: Joi.string().label('nodeENV server').required(),
        SECRET_KEY_EMAIL: Joi.string()
          .label('secretKeyEmail server')
          .required(),
      }),
    }),
    LoggerModule,
    HealthModule,
    CallSummarizationModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((_req, response, next) => {
        response.setHeader('X-XSS-Protection', '1; mode=block');
        response.setHeader('X-Content-Type-Options', 'nosniff');
        response.setHeader('X-Frame-Options', 'DENY');
        response.setHeader('Content-Security-Policy', "default-src 'self'");
        response.setHeader(
          'Strict-Transport-Security',
          'max-age=15552000; includeSubDomains',
        );
        // response.setHeader('Referrer-Policy', 'no-referrer');
        next();
      })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
