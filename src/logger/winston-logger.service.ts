import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import awsConfig from './../config/aws.config';
import { Logger } from 'aws-cloudwatch-log';
import * as moment from 'moment-timezone';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger;
  private serviceName = 'api';
  private systemName = 'socket-backend';

  constructor(
    @Inject(awsConfig.KEY)
    private readonly aws: ConfigType<typeof awsConfig>,
  ) {
    const config = {
      accessKeyId: aws.accessKeyId,
      secretAccessKey: aws.secretAccessKey,
      region: aws.region,
      logGroupName: aws.cloudWatch.logGroup,
      logStreamName: aws.cloudWatch.logStream,
      jsonMessage: true,
      uploadFreq: 10, // Optional. Send logs to AWS LogStream in batches after 10 seconds intervals.
      local: !(this.aws.cloudWatch.show === 'enable' && this.aws?.accessKeyId),
    };

    if (this.aws.cloudWatch.show === 'enable') {
      this.logger = new Logger(config);
    }
  }

  private logSystem({
    action = 'log',
    context = '',
    meta = null,
    message = '',
  }: {
    context?: string;
    message?: any;
    meta?: Record<string, unknown>;
    action: 'log' | 'info' | 'error' | 'warn' | 'debug' | 'verbose';
  }) {
    const date = moment().format('YYYY-MM-DD HH:mm:ss.Z');
    const textMessage = `${date} | ${action} | ${this.systemName} | ${
      this.serviceName
    } | ${meta?.processId ? meta?.processId : context || ''}${
      typeof message === 'string' ? ' | ' + message : ''
    }`;

    let textColor = '\x1b[32m';
    if (action === 'error') {
      textColor = '\x1b[31m';
    } else if (action === 'warn') {
      textColor = '\x1b[33m';
    } else if (action === 'debug') {
      textColor = '\x1b[36m';
    } else if (action === 'verbose') {
      textColor = '\x1b[35m';
    }

    try {
      if (meta && this.aws.cloudWatch.show === 'enable') {
        console.info(
          `${textColor}%s\x1b[0m \x1b[33m[%s]\x1b[0m %s `,
          date,
          context ? context : 'info',
          message,
          meta,
        );
      } else {
        if (this.aws.cloudWatch.showMeta === 'enable') {
          console.info(
            `${textColor}%s\x1b[0m \x1b[33m[%s]\x1b[0m %s `,
            date,
            context ? context : 'info',
            message,
            meta,
          );
        } else {
          console.info(
            `${textColor}%s\x1b[0m \x1b[33m[%s]\x1b[0m %s `,
            date,
            context ? context : 'info',
            message,
          );
        }
      }

      if (this.aws.cloudWatch.show === 'enable') {
        if (typeof message === 'string') {
          if (
            meta &&
            typeof meta === 'object' &&
            Object.keys(meta)?.filter((v) => v !== 'processId')?.length > 0
          ) {
            this.logger.log(textMessage, {
              log: action,
              ...meta,
            });
          } else {
            this.logger.log(textMessage);
          }
        } else {
          this.logger.log(textMessage, {
            log: action,
            message,
            meta,
          });
        }
      }
    } catch (error) {
      if (meta) {
        console.info(
          `${textColor}%s\x1b[0m \x1b[33m[%s]\x1b[0m %s `,
          date,
          context ? context : 'info',
          message,
          meta,
        );
      } else {
        console.info(
          `${textColor}%s\x1b[0m \x1b[33m[%s]\x1b[0m %s `,
          date,
          context ? context : 'info',
          message,
        );
      }

      if (this.aws.cloudWatch.show === 'enable') {
        this.logger.log('log winston error ' + textMessage, {
          log: action,
          message: message?.message,
          meta: {
            message: message?.meta?.message,
            status: message?.meta?.status,
            statusCode: message?.meta?.statusCode,
            title: message?.meta?.title,
            time: message?.meta?.time,
            errorText: message?.meta?.errorText,
            error,
          },
        });
      }
    }
  }

  error(
    message: any,
    trace?: string,
    context?: string,
    meta?: Record<string, unknown>,
  ): any {
    this.logSystem({
      context,
      message,
      meta: {
        ...meta,
        message,
        stackTrace: trace,
      },
      action: 'error',
    });
  }

  /**
   *
   * @param message
   * @param context ชื่อ function ที่เรียกใช้
   * @param meta
   */
  log(message: any, context?: string, meta?: Record<string, unknown>): any {
    this.logSystem({
      context,
      message,
      meta,
      action: 'info',
    });
  }

  warn(message: any, context?: string, meta?: Record<string, unknown>): any {
    this.logSystem({
      context,
      message,
      meta,
      action: 'warn',
    });
  }

  debug(message: any, context?: string, meta?: Record<string, unknown>): any {
    this.logSystem({
      context,
      message,
      meta,
      action: 'debug',
    });
  }

  verbose(message: any, context?: string, meta?: Record<string, unknown>): any {
    this.logSystem({
      context,
      message,
      meta,
      action: 'verbose',
    });
  }
}
