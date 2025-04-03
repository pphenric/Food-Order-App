import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

export async function runQuery (sqlQuery: string) {
    dotenv.config();
    if (!process.env.DATABASE_URL) {
      throw new Error('Invalid process.env.DATABASE_URL string');
    }
    const sql = neon(process.env.DATABASE_URL);
    const response = await sql.query(sqlQuery);
    return response;
}