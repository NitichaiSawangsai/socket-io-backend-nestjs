import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CognitoAuthGuard } from '../auth/guards/cognito.guard';
import { SendMessageDto } from './dtos/call-summarization.dto';
import CallSummarizationService from './call-summarization.service';
import { ActionCallSummarizationType } from './call-summarization.enum';

@ApiBearerAuth()
@UseGuards(CognitoAuthGuard)
@ApiTags('CallSummarization')
@Controller('/api/v1/call-summarization')
export class CallSummarizationController {
  constructor(
    private readonly callSummarizationService: CallSummarizationService,
  ) {}

  @ApiCreatedResponse()
  @Post('send-message')
  sendMessage(@Body() body: SendMessageDto) {
    return this.callSummarizationService.sendMessage(body);
  }

  @ApiOkResponse()
  @ApiParam({
    name: 'action',
    enum: ActionCallSummarizationType,
    description: 'Action type for call summarization, ENUM: request, response',
    example: ActionCallSummarizationType.Request,
  })
  @ApiParam({
    name: 'phone',
    description: 'The phone number to process',
    example: '09888xxxx',
    required: true,
  })
  @Get('/:action/:phone')
  getMessageByPhone(
    @Param('phone') phone: string,
    @Param('action') action: ActionCallSummarizationType,
  ) {
    return this.callSummarizationService.getMessageByPhone(phone, action);
  }

  @ApiOkResponse()
  @ApiParam({
    name: 'action',
    enum: ActionCallSummarizationType,
    description: 'Action type for call summarization, ENUM: request, response',
    example: ActionCallSummarizationType.Request,
  })
  @ApiParam({
    name: 'phone',
    description: 'The phone number to process',
    example: '09888xxxx',
    required: true,
  })
  @Delete('delect-message/:action/:phone')
  delectMessageByPhone(
    @Param('phone') phone: string,
    @Param('action') action: ActionCallSummarizationType,
  ) {
    return this.callSummarizationService.delectMessageByPhone(phone, action);
  }

  @ApiOkResponse()
  @Delete('delect-messages')
  deleteAllMessages() {
    return this.callSummarizationService.deleteAllMessages();
  }
}
