import { Inject, Injectable } from '@nestjs/common';
import {
  DeleteMessageBatchCommand,
  DeleteMessageBatchRequestEntry,
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
  SendMessageCommand,
} from '@aws-sdk/client-sqs';
import awsConfig from '../../config/aws.config';
import { ConfigType } from '@nestjs/config';
import { WinstonLoggerService } from '../../logger/winston-logger.service';
import { LOGGER_SERVICE } from '../../common/constants/app.constants';
import {
  ReceiveMessageSQSDto,
  SendMessageSQSDto,
} from '../dtos/third-party.dto';

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
      useQueueUrlAsEndpoint: true,
    });
  }

  async sendMessage(body: SendMessageSQSDto): Promise<{
    status: number;
    data: any;
  }> {
    try {
      const command = new SendMessageCommand({
        MessageBody: JSON.stringify({
          data: body.data,
        }),
        QueueUrl: this.config.sqs.url,
        MessageAttributes: body.MessageAttributes,
      });

      const result = await this.sqs.send(command);
      if (result?.$metadata?.httpStatusCode === 200) {
        return {
          status: 200,
          data: result,
        };
      }
    } catch (err) {
      this.logger.error('Error sending message: ', err);
      if (err.$response) {
        console.error('Error sending message: ', err.$response);
      }
    }

    return {
      status: 500,
      data: null,
    };
  }

  async receiveMessage(body: ReceiveMessageSQSDto = {}): Promise<{
    status: number;
    data: any;
  }> {
    try {
      /**
       * MaxNumberOfMessages: กำหนดจำนวนข้อความที่ต้องการดึงจากคิว
       * WaitTimeSeconds: กำหนดระยะเวลาที่ SQS จะรอข้อความใหม่
       * MessageAttributeNames: ระบุแอตทริบิวต์ของข้อความที่ต้องการดึง
       * VisibilityTimeout: เวลาที่ข้อความจะไม่สามารถถูกดึงซ้ำหลังจากที่มันถูกดึงออกจากคิว

       */
      const command = new ReceiveMessageCommand({
        QueueUrl: this.config.sqs.url,
        MaxNumberOfMessages: body?.maxNumberOfMessages ?? 30,
        WaitTimeSeconds: body?.waitTimeSeconds ?? 60,
        MessageAttributeNames: body?.messageAttributeNames ?? ['All'],
        VisibilityTimeout: body?.visibilityTimeout ?? 30,
      });
      const result = await this.sqs.send(command);
      if (result?.$metadata?.httpStatusCode === 200) {
        return {
          status: 200,
          data: result,
        };
      }
    } catch (err) {
      this.logger.error('Error receiving message: ', err);
      if (err.$response) {
        console.error('Error receiving message: ', err.$response);
      }
    }

    return {
      status: 500,
      data: null,
    };
  }

  async deleteMessageFromQueue(
    data: string | DeleteMessageBatchRequestEntry[],
  ): Promise<{
    status: number;
    data: any;
  }> {
    try {
      let command;
      if (typeof data === 'string' && data) {
        command = new DeleteMessageCommand({
          QueueUrl: this.config.sqs.url,
          ReceiptHandle: data,
        });
      } else if (data?.length > 0) {
        command = new DeleteMessageBatchCommand({
          QueueUrl: this.config.sqs.url,
          Entries: data as DeleteMessageBatchRequestEntry[],
        });
      } else {
        return {
          status: 404,
          data: null,
        };
      }

      const result = await this.sqs.send(command);
      if (result?.$metadata?.httpStatusCode === 200) {
        return {
          status: 200,
          data: result,
        };
      }
    } catch (err) {
      this.logger.error('Error deleting message: ', err);
      if (err.$response) {
        console.error('Error deleting message: ', err.$response);
      }
    }

    return {
      status: 500,
      data: null,
    };
  }

  async deleteAllMessages(): Promise<{
    status: number;
    message: string;
  }> {
    const receiveCommand = new ReceiveMessageCommand({
      QueueUrl: this.config.sqs.url,
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ['All'],
      WaitTimeSeconds: 15,
      VisibilityTimeout: 10,
    });

    try {
      let messages = await this.sqs.send(receiveCommand);
      messages = messages?.Messages || [];
      if (messages?.length > 0) {
        const deleteEntries: DeleteMessageBatchRequestEntry[] = messages.map(
          (message, index) => ({
            Id: index.toString(),
            ReceiptHandle: message.ReceiptHandle,
          }),
        );
        const result = await this.deleteMessageFromQueue(deleteEntries);
        if (result?.status === 200) {
          return {
            status: result?.status,
            message: 'All messages deleted successfully.',
          };
        }
      }
    } catch (error) {
      this.logger.error('Error deleting message: ', error);
      console.error('Error deleting messages:', error);
      return {
        status: 500,
        message: 'An error occurred while deleting messages.',
      };
    }

    return {
      status: 404,
      message: 'No messages to delete.',
    };
  }
}
