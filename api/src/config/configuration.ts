import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  api_secret: process.env.API_KEY_SECRET,
  api_secret_refresh: process.env.API_KEY_SECRET_REFRESH,
  salt_hash: process.env.SALT_HASH || 'salt_hash',
}));
