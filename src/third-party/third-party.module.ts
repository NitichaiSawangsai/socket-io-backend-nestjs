import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../logger/logger.module';
import awsConfig from '../config/aws.config';
import SQSService from './services/sqs.service';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      load: [awsConfig],
    }),
  ],
  providers: [SQSService],
  exports: [SQSService],
})
export class ThirdPartyModule {}
