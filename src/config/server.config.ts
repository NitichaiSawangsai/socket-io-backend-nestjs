import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  port: process.env.SERVER_PORT,
  nodeENV: process.env.NODE_ENV || 'development',
  secretKeyEmail: process.env.SECRET_KEY_EMAIL,
}));
