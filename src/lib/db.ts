import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('Invalid process.env.DATABASE_URL string');
}
const sql = neon(process.env.DATABASE_URL);

export async function runQuery (sqlQuery: string) {
    const response = await sql.query(sqlQuery);
    return response;
}