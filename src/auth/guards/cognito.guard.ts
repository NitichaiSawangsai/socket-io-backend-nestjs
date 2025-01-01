import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { RequestWithAuth } from '../../common/types/auth';

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  // private readonly logger = new Logger(CognitoAuthGuard.name);
  constructor() {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: RequestWithAuth = context.switchToHttp().getRequest();

    console.log('request ', request)

    // this.logger.debug(`Checking for auth token on request body`, request.body);

    const { accessToken } = request.body;

    try {
      // const payload = this.jwtService.verify(accessToken);
      // // append user and poll to socket
      // request.userID = payload.sub;
      // request.pollID = payload.pollID;
      // request.name = payload.name;
      return true;
    } catch {
      throw new ForbiddenException('Invalid authorization token');
    }
  }
}
