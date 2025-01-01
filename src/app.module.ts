import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CallSummarizationModule } from './call-summarization/call-summarization.module';

@Module({
  imports: [CallSummarizationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
