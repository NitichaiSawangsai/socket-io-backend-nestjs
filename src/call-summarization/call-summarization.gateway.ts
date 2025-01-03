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
import CallSummarizationService from './call-summarization.service';

@ApiBearerAuth()
@UseGuards(CognitoAuthGuard)
@ApiTags('CallSummarization')
@WebSocketGateway({
  namespace: 'call-summarization',
})
export class CallSummarizationGeteway extends BaseGateway {
  constructor(
    private readonly callSummarizationService: CallSummarizationService,
  ) {
    super(CallSummarizationGeteway.name);
  }

  @SubscribeMessage('receiveMessageCallSummarization')
  async onNewMessage(
    @MessageBody('phone') phone: string,
    @ConnectedSocket() client: SocketWithAuth,
  ) {
    // const result =
    //   await this.callSummarizationService.listCallSummarizationByPhone(phone);

    this.io.to(client.id).emit('send_data', {
      status: 200,
      // data: result,
    });
  }
}
