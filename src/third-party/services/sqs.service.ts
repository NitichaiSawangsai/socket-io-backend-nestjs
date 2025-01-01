import { Inject, Injectable } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import awsConfig from '../../config/aws.config';
import { ConfigType } from '@nestjs/config';
import { WinstonLoggerService } from '../../logger/winston-logger.service';
import { LOGGER_SERVICE } from '../../common/constants/app.constants';

@Injectable()
export default class SQSService {
  private sqs;

  constructor(
    @Inject(awsConfig.KEY)
    private readonly config: ConfigType<typeof awsConfig>,
    @Inject(LOGGER_SERVICE)
    private readonly logger: WinstonLoggerService,
  ) {
    this.sqs = new SQSClient({
      credentials: {
        accessKeyId: this.config.sqs.accessKeyId,
        secretAccessKey: this.config.sqs.secretAccessKey,
      },
      region: this.config.region,
      endpoint: this.config.sqs.url,
      useQueueUrlAsEndpoint: true,
    });
  }

  async sendMessage() {
    const message = {
      something: 'here',
    };

    const params = {
      QueueUrl: this.config.sqs.url,
      MessageBody: JSON.stringify(message),
    };
    try {
      const data = await this.sqs.send(new SendMessageCommand(params));
      return data;
    } catch (err) {
      this.logger.error('Error sending message', err);
      if (err.$response) {
        console.error('Raw Response:', err.$response);
      }
      throw err;
    }
  }
}
