import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonLoggerService } from './winston-logger.service';
import awsConfig from './../config/aws.config';
import { LOGGER_SERVICE } from '../common/constants/app.constants';

@Module({
  providers: [
    {
      provide: LOGGER_SERVICE,
      useClass: WinstonLoggerService,
    },
  ],
  exports: [LOGGER_SERVICE],
  imports: [ConfigModule.forFeature(awsConfig)],
})
export class LoggerModule {}
