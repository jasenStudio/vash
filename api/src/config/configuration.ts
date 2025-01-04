import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  api_secret: `.env.${process.env.NODE_ENV || 'development'}`,
  salt_hash: process.env.SALT_HASH || 'salt_hash',
}));
