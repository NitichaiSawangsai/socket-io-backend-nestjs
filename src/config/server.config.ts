import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  port: process.env.SERVER_PORT || 3001,
  nodeENV: process.env.NODE_ENV || 'development',
  secretKeyEmail: process.env.SECRET_KEY_EMAIL,
  version: process.env.VERSION,
}));
