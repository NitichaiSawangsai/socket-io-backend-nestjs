import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CallSummarizationModule } from './call-summarization/call-summarization.module';
import serverConfig from './config/server.config';
import awsConfig from './config/aws.config';
import databaseConfig from './config/database.config';
import * as Joi from 'joi';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [databaseConfig, serverConfig, awsConfig],
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().label('nodeENV server').required(),
        SERVER_PORT: Joi.number().port().label('port server').required(),
        SECRET_KEY_EMAIL: Joi.string()
          .label('secretKeyEmail server')
          .required(),
        DATABASE_HOST: Joi.string().label('DATABASE_HOST').required(),
        DATABASE_PORT: Joi.number().label('DATABASE_PORT').required(),
        DATABASE_USERNAME: Joi.string().label('DATABASE_USERNAME').required(),
        DATABASE_PASSWORD: Joi.string().label('DATABASE_PASSWORD').required(),
        DATABASE_NAME: Joi.string().label('DATABASE_NAME').required(),
        DATABASE_SYNC: Joi.string().label('DATABASE_SYNC').required(),
        DATABASE_SCHEMA: Joi.string().label('DATABASE_SCHEMA').required(),
        TZ: Joi.string().label('TZ').required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): any => ({
        type: configService.get<'postgres' | 'sqlite'>('database.type'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        autoLoadEntities: true,
        synchronize:
          configService.get<string>('database.syncEnabled') === 'enable',
        cli: { migrationsDir: 'src/migrations' },
        namingStrategy: new SnakeNamingStrategy(),
        ssl:
          configService.get<string>('database.SSLEnable') === 'enable'
            ? {
                sslmode: 'require',
                rejectUnauthorized: false,
              }
            : undefined,
        extra: {
          schema: configService.get<string>('database.schema'),
        },
      }),
    }),

    LoggerModule,
    HealthModule,
    CallSummarizationModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
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
