import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler } from './middlewares/error.middleware';

import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profiles.routes';
import servicesRoutes from './routes/services.routes';
import jobsRoutes from './routes/jobs.routes';
import ideasRoutes from './routes/ideas.routes';
import coursesRoutes from './routes/courses.routes';
import notificationsRoutes from './routes/notifications.routes';
import messagesRoutes from './routes/messages.routes';
import searchRoutes from './routes/search.routes';
import savedRoutes from './routes/saved.routes';
import adminRoutes from './routes/admin.routes';
import clientDigitalRoutes from './routes/clientDigital.routes';

const app = express();

// Middlewares
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'The Marketplace API', version: '1.0.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/ideas', ideasRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/client/digital', clientDigitalRoutes);

// Error Handler
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 The Marketplace API running on http://localhost:${config.port}`);
  console.log(`📊 Health check: http://localhost:${config.port}/api/health`);
});
