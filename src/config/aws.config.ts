import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
  cloudWatch: {
    logGroup: process.env.CLOUD_WATCH_LOG_GROUP,
    logStream: process.env.CLOUD_WATCH_LOG_STREAM,
    show: process.env.CLOUD_WATCH_LOG_SHOW || 'disable',
    showMeta: process.env.CLOUD_WATCH_LOG_META_SHOW || 'enable',
  },
  cognitoDomain: process.env.COGNITO_DOMAIN,
  sqs: {
    accessKeyId: process.env.SQS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SQS_SECRET_ACCESS_KEY,
    url: process.env.SQS_URL,
  },
}));
