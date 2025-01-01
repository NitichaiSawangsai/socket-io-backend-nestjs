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
    const corsOptions = {
      origin: [],
    };

    this.logger.log('Configuring SocketIO server with custom CORS options', {
      corsOptions,
    });

    const optionsWithCORS: ServerOptions = {
      ...options,
      // cors: corsOptions,
    };

    const server: Server = super.createIOServer(port, optionsWithCORS);

    server.of('polls').use(createTokenMiddleware(this.logger));

    return server;
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
