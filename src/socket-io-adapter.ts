import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { SocketWithAuth } from './common/types/auth';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    // const clientPort = parseInt(this.configService.get('CLIENT_PORT'));

    // const cors = {
    //   origin: [
    //     `http://localhost:${clientPort}`,
    //     new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
    //   ],
    // };

    // this.logger.log('Configuring SocketIO server with custom CORS options', {
    //   cors,
    // });

    const optionsWithCORS: ServerOptions = {
      ...options,
      // cors,
    };

    console.log('port ', port)

    // const server: Server = super.createIOServer(port, optionsWithCORS);

    // server.of('polls').use(createTokenMiddleware(this.logger));

    // return server;
  }
}

const createTokenMiddleware =
  (logger: Logger) => (socket: SocketWithAuth, next) => {
    // for Postman testing support, fallback to token header
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    logger.debug(`Validating auth token before connection: ${token}`);

    try {
      // socket.userID = payload.sub;
      // socket.pollID = payload.pollID;
      // socket.name = payload.name;
      next();
    } catch {
      next(new Error('FORBIDDEN'));
    }
  };
