import { Logger, OnModuleInit } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { SocketWithAuth } from '../types/auth';

export class BaseGateway
  implements
    OnModuleInit,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect
{
  @WebSocketServer()
  io: Namespace;

  protected readonly logger: Logger;

  constructor(gatewayName: string) {
    this.logger = new Logger(gatewayName);
  }

  onModuleInit() {
    this.io.on('connection', () => {
      this.logger.log(`socket connection`);
    });
  }

  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  async handleConnection(client: SocketWithAuth) {
    const roomName = client.id;
    try {
      const sockets = this.io.sockets;
      await client.join(roomName);
      const connectedClients = this.io.adapter.rooms?.get(roomName)?.size ?? 0;
      this.logger.log(
        `Socket connected with userID: ${client.userId}, and email: "${client.email}" joined room with name: ${roomName}`,
      );
      this.logger.log(`Number of connected sockets: ${sockets.size}`);
      this.logger.log(
        `Total clients connected to room '${roomName}': ${connectedClients}`,
      );
      this.io.to(client.id).emit('status_connection', {
        socketsId: roomName,
        status: 200,
      });
    } catch (error) {
      this.io.to(client.id).emit('status_connection', {
        socketsId: roomName,
        status: 500,
        error,
      });
    }
  }

  async handleDisconnect(client: SocketWithAuth) {
    const roomName = client.id;
    try {
      const sockets = this.io.sockets;

      const clientCount = this.io.adapter.rooms?.get(roomName)?.size ?? 0;

      this.logger.log(`Disconnected socket id: ${roomName}`);
      this.logger.debug(`Number of connected sockets: ${sockets.size}`);
      this.logger.debug(
        `Total clients connected to room '${roomName}': ${clientCount}`,
      );

      this.io.emit('status_connection', {
        socketsId: roomName,
        status: 404,
      });
    } catch (error) {
      this.io.emit('status_connection', {
        socketsId: roomName,
        status: 500,
        error,
      });
    }
  }
}
