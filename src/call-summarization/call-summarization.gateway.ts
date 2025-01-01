import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { CognitoAuthGuard } from '../auth/guards/cognito.guard';
import { SocketWithAuth } from '../common/types/auth';
import { BaseGateway } from '../common/gateways/base.gateway';
import SQSService from '../third-party/services/sqs.service';

@ApiBearerAuth()
@UseGuards(CognitoAuthGuard)
@ApiTags('CallSummarization')
@WebSocketGateway({
  namespace: 'call-summarization',
})
export class CallSummarizationGeteway extends BaseGateway {
  constructor(private readonly sqsService: SQSService) {
    super(CallSummarizationGeteway.name);
  }

  @SubscribeMessage('newMessage')
  async onNewMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    await this.sqsService.sendMessage();
    this.io.to(client.id).emit('send_data', {
      status: 200,
      data,
    });
  }
}
