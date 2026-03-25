const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const isProd = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  // Most hosted DBs (Neon, Supabase) require SSL for connections
  ssl: isProd ? { rejectUnauthorized: false } : false,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error);
});

async function checkDatabaseConnection() {
  const client = await pool.connect();

  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  checkDatabaseConnection,
};
