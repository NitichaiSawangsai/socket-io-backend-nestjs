import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CallSummarizationModule } from './call-summarization/call-summarization.module';
import serverConfig from './config/server.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [serverConfig],
    }),
    CallSummarizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
