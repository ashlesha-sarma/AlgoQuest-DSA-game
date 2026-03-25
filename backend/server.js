require('dotenv').config();

const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const { pool, checkDatabaseConnection } = require('./src/db/pool');
const { initializeDatabase } = require('./src/db/init');

const app = express();

function validateEnvironment() {
  const missing = ['DATABASE_URL', 'JWT_SECRET', 'FRONTEND_URL'].filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/problems', require('./src/routes/problems'));
app.use('/api/progress', require('./src/routes/progress'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((error, _req, res, _next) => {
  console.error('Unhandled server error:', error);
  res.status(500).json({ error: 'Internal server error.' });
});

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  validateEnvironment();
  await checkDatabaseConnection();
  await initializeDatabase();

  const server = app.listen(PORT, () => {
    console.log(`AlgoQuest API running at http://localhost:${PORT}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer().catch((error) => {
  console.error('Failed to start AlgoQuest API:', error);
  process.exit(1);
});

module.exports = app;
