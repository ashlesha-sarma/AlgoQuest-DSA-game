require('dotenv').config();

const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const { pool, checkDatabaseConnection } = require('./src/db/pool');
const { initializeDatabase } = require('./src/db/init');

const app = express();

/* =========================
   ENV VALIDATION
========================= */
function validateEnvironment() {
  const missing = ['DATABASE_URL', 'JWT_SECRET', 'FRONTEND_URL'].filter(
    (key) => !process.env[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

/* =========================
   CORS CONFIG (FINAL FIX)
========================= */
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
]
  .filter(Boolean)
  .map((origin) => origin.toLowerCase().replace(/\/$/, '')); // normalize + remove trailing slash

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.toLowerCase().replace(/\/$/, '');

      const allowed =
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.includes('.vercel.app');

      if (allowed) {
        callback(null, true);
      } else {
        console.log('❌ Blocked by CORS:', origin);
        callback(null, false); // don't crash server
      }
    },
    credentials: true,
  })
);

/* =========================
   MIDDLEWARE
========================= */
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

/* =========================
   ROUTES
========================= */
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/problems', require('./src/routes/problems'));
app.use('/api/progress', require('./src/routes/progress'));

/* =========================
   HEALTH CHECK
========================= */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* =========================
   404 HANDLER
========================= */
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

/* =========================
   ERROR HANDLER
========================= */
app.use((error, _req, res, _next) => {
  console.error('Unhandled server error:', error);
  res.status(500).json({ error: 'Internal server error.' });
});

/* =========================
   SERVER START
========================= */
const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  validateEnvironment();
  await checkDatabaseConnection();
  await initializeDatabase();

  const server = app.listen(PORT, () => {
    console.log(`🚀 AlgoQuest API running on port ${PORT}`);
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
  console.error('❌ Failed to start AlgoQuest API:', error);
  process.exit(1);
});

module.exports = app;