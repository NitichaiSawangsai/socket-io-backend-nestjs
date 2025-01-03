import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dtos/call-summarization.dto';
import SQSService from '../third-party/services/sqs.service';
import { DeleteMessageBatchRequestEntry } from '@aws-sdk/client-sqs';
import { ActionCallSummarizationType } from './call-summarization.enum';

@Injectable()
export default class CallSummarizationService {
  constructor(private readonly sqsService: SQSService) {}

  async sendMessage(body: SendMessageDto) {
    const result = await this.sqsService.sendMessage({
      data: {
        data: body.data,
        action: body.action,
        phone: body.phone,
        clientId: body.clientId,
      },
      MessageAttributes: {
        data: {
          DataType: 'String',
          StringValue: `${body.action}-${body.phone}`,
        },
      },
    });
    return result;
  }

  async getMessageByPhone(phone: string, action: ActionCallSummarizationType) {
    const result = await this.sqsService.receiveMessage({
      maxNumberOfMessages: 10,
      messageAttributeNames: ['All'],
      waitTimeSeconds: 15,
      visibilityTimeout: 10,
    });
    let messages = result?.data?.Messages || [];
    messages = messages
      .map((v) => {
        return JSON.parse(v?.Body)?.data;
      })
      .filter((v) => {
        return v?.phone === phone && v?.action === action;
      });

    return {
      status: result?.status,
      data: messages,
    };
  }

  async delectMessageByPhone(
    phone: string,
    action: ActionCallSummarizationType,
  ) {
    try {
      const result = await this.sqsService.receiveMessage({
        maxNumberOfMessages: 10,
        visibilityTimeout: 20,
        waitTimeSeconds: 20,
      });
      const messages = result?.data?.Messages || [];
      if (messages.length > 0) {
        const deleteEntries: DeleteMessageBatchRequestEntry[] = messages
          .filter((message) => {
            const data = JSON.parse(message?.Body)?.data;
            return data?.phone === phone && data?.action === action;
          })
          .map((message, index) => ({
            Id: index.toString(),
            ReceiptHandle: message.ReceiptHandle,
          }));

        if (deleteEntries.length > 0) {
          const result =
            await this.sqsService.deleteMessageFromQueue(deleteEntries);
          return result;
        }
      }
    } catch (error) {
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

  deleteAllMessages() {
    return this.sqsService.deleteAllMessages();
  }
}
