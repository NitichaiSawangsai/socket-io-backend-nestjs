import { Module } from '@nestjs/common';
import { CallSummarizationGeteway } from './call-summarization.gateway';
import { ThirdPartyModule } from '../third-party/third-party.module';

@Module({
  imports: [ThirdPartyModule],
  controllers: [],
  providers: [CallSummarizationGeteway],
})
export class CallSummarizationModule {}
