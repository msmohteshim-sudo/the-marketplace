import app from './app';
import { config } from './config/env';

if (!process.env.VERCEL) {
  app.listen(config.port, () => {
    console.log(`🚀 The Marketplace API running on http://localhost:${config.port}`);
    console.log(`📊 Health check: http://localhost:${config.port}/api/health`);
  });
}

export default app;
