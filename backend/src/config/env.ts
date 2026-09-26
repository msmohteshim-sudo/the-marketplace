import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const config = {
  port: process.env.PORT || 5001,
  jwtSecret: process.env.JWT_SECRET || 'marketplace-fallback-secret',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  gmailUser: process.env.GMAIL_USER || '',
  gmailPass: process.env.GMAIL_APP_PASSWORD || ''
};
