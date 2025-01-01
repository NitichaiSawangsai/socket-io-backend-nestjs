import { Module } from '@nestjs/common';
import { CallSummarizationGeteway } from './call-summarization.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [CallSummarizationGeteway],
})
export class CallSummarizationModule {}
