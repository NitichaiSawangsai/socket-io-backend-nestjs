import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

@Exclude()
export class SendMessageSQSDto {
  @ApiProperty({
    example: '1223',
    description: 'type: string | number | unknown',
  })
  @IsNotEmpty()
  @Expose()
  data: string | number | unknown;

  @ApiProperty({
    example: {
      data: {
        DataType: 'String',
        StringValue: '0933xxxxxx',
      },
    },
  })
  @IsNotEmpty()
  @IsObject()
  @Expose()
  MessageAttributes: Record<string, { DataType: string; StringValue: string }>;
}

@Exclude()
export class ReceiveMessageSQSDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Expose()
  maxNumberOfMessages?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Expose()
  waitTimeSeconds?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Expose()
  visibilityTimeout?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Expose()
  messageAttributeNames?: string[];
}
