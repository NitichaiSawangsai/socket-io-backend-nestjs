process.env = {
  NODE_ENV: 'development',
  SERVER_PORT: '3001',
  SECRET_KEY_EMAIL: '12345',
  COGNITO_DOMAIN: 'https://xxx.auth.ap-southeast-1.amazoncognito.com',

  DATABASE_TYPE: 'sqlite',
  DATABASE_NAME: ':memory:',
  DATABASE_SYNC: 'enable',
  DATABASE_HOST: 'localhost',
  DATABASE_PORT: '5432',
  DATABASE_USERNAME: 'postgres',
  DATABASE_PASSWORD: '12345',
  DATABASE_SCHEMA: 'public',
  TZ: 'UTC',
};
