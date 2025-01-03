import { Module } from '@nestjs/common';
import { CallSummarizationGeteway } from './call-summarization.gateway';
import { ThirdPartyModule } from '../third-party/third-party.module';
import CallSummarizationService from './call-summarization.service';
import { CallSummarizationController } from './call-summarization.controller';

@Module({
  imports: [ThirdPartyModule],
  controllers: [CallSummarizationController],
  providers: [CallSummarizationGeteway, CallSummarizationService],
})
export class CallSummarizationModule {}
