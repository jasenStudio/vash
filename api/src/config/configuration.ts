import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  api_secret: process.env.API_KEY_SECRET,
}));
