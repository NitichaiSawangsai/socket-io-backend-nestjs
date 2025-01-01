import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { SocketWithAuth } from '../../common/types/auth';

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const client: SocketWithAuth = context.switchToWs().getClient();

    const accessToken = client?.handshake?.headers?.token;
    console.log('WsGuard ++++ ', accessToken);

    try {
      // client.userID = 'aaa';
      // client.pollID = 'ddff';
      // client.name = 'dddff';
      return true;
    } catch {
      throw new ForbiddenException('Invalid authorization token');
    }
  }
}
