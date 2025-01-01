import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { v1 as uuidv1 } from 'uuid';
import { WinstonLoggerService } from '../../logger/winston-logger.service';
import { LOGGER_SERVICE } from '../constants/app.constants';
import { transformerValueGetLog } from '../utils/hash-data-identifiable.utils';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: WinstonLoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const className = context.getClass().name;
    const methodKey = context.getHandler().name;
    const type = context.getType();
    const processId = uuidv1();
    let args = {};
    if (type === 'http') {
      const { params, body, headers, query, url, method } = context
        .switchToHttp()
        .getRequest();

      delete headers?.['Authorization'];
      delete headers?.['authorization'];
      delete headers?.['clientId'];
      delete headers?.['ClientId'];
      delete headers?.['clientSecret'];
      delete headers?.['ClientSecret'];
      delete headers?.['cookie'];
      delete headers?.['accept'];

      let textUrl = url;
      if (url?.indexOf('?') > -1) {
        textUrl = url?.split('?')?.[0];
      } else if (url) {
        const strUrls = url.split('/');
        const strUrlLast = strUrls?.[strUrls.length - 1];
        if (strUrlLast) {
          strUrls[strUrls.length - 1] = transformerValueGetLog(
            strUrls[strUrls.length - 1],
            'textNoNObj',
          );
        }
        textUrl = strUrls?.join('/');
      }

      args = {
        ...args,
        url: textUrl,
        method,
        headers,
        query: transformerValueGetLog(query),
        params: transformerValueGetLog(params),
        body: transformerValueGetLog(body),
      };
    }

    const executionContext = `${className}.${methodKey}`;
    this.logger.log('request function', executionContext, {
      processId,
      args,
    });

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        return this.logger.log(
          `response function time: ${Date.now() - now} ms`,
          executionContext,
          {
            processId,
          },
        );
      }),
      catchError((err: Error) => {
        this.logger.error(err.message, err.stack, executionContext, {
          processId,
          args,
        });
        throw err;
      }),
    );
  }
}
