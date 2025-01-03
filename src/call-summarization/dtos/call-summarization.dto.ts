import { Exclude, Expose } from 'class-transformer';
import { ActionCallSummarizationType } from '../call-summarization.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class SendMessageDto {
  @ApiProperty({
    example: 'request|response',
    enum: ActionCallSummarizationType,
    description: 'Action type for call summarization, ENUM: request, response',
  })
  @IsEnum(ActionCallSummarizationType, {
    message: 'Action must be either request or response',
  })
  @IsNotEmpty()
  @Expose()
  action: ActionCallSummarizationType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  clientId: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  phone: string;

  @ApiProperty({
    description: 'type: string | number | unknown',
    example: '1223',
  })
  @IsNotEmpty()
  @Expose()
  data: string | number | unknown;
}
