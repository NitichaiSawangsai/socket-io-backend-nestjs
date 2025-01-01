import { Logger, OnModuleInit, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { CognitoAuthGuard } from '../auth/guards/cognito.guard';

@ApiBearerAuth()
@UseGuards(CognitoAuthGuard)
// @SetMetadata('roles', RoleDashboard)
// @Controller('/test/avaya/api/v1/csat')
@ApiTags('CallSummarization')
@WebSocketGateway({
  namespace: 'call-summarization',
})
// OnGatewayDisconnect
export class CallSummarizationGeteway
  implements OnModuleInit, OnGatewayInit, OnGatewayConnection
{
  private readonly logger = new Logger(CallSummarizationGeteway.name);
  // private readonly roomName = null;
  constructor() {}

  @WebSocketServer()
  io: Namespace;

  onModuleInit() {
    this.io.on('connection', (socket) => {
      console.log('new connection');
    });
  }

  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  async handleConnection(client: any) {
    // console.log('handleConnection ++++');
    // const sockets = this.io.sockets;

    // this.logger.debug(
    //   `Socket connected with userID: ${client.userID}, pollID: ${client.pollID}, and name: "${client.name}"`,
    // );

    // this.logger.log(`WS Client with id: ${client.id} connected!`);
    // this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    // const roomName = client.pollID;
    // await client.join(roomName);

    // const connectedClients = this.io.adapter.rooms?.get(roomName)?.size ?? 0;

    // this.logger.debug(
    //   `userID: ${client.userID} joined room with name: ${roomName}`,
    // );
    // this.logger.debug(
    //   `Total clients connected to room '${roomName}': ${connectedClients}`,
    // );

    // console.log('client ', client);
    // this.io.to(roomName).emit('poll_updated', 'AOM22233');
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('newMessage ', data);
    // this.io.to(roomName).emit('poll_updated', 'AOM22233');
  }
}
