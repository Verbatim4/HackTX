import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import benefitsRoutes from './routes/benefits.js';
import voiceRoutes from './routes/voice.js';
import aiRoutes from './routes/ai.js';
import alertsRoutes from './routes/alerts.js';
import eligibilityRoutes from './routes/eligibility.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/benefits', benefitsRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/eligibility', eligibilityRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Polara API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

