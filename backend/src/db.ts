import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected PG client error', err);
});

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
  pool,
};
