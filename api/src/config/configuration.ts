import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  api_secret: `.env.${process.env.NODE_ENV || 'development'}`,
}));
