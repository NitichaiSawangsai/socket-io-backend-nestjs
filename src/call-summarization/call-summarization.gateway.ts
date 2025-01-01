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

@ApiBearerAuth()
@UseGuards(CognitoAuthGuard)
@ApiTags('CallSummarization')
@WebSocketGateway({
  namespace: 'call-summarization',
})
export class CallSummarizationGeteway extends BaseGateway {
  constructor() {
    super(CallSummarizationGeteway.name);
  }

  @SubscribeMessage('newMessage')
  onNewMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    this.io.to(client.id).emit('send_data', {
      status: 200,
      data,
    });
  }
}
