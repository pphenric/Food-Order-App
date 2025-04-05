import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private sql: NeonQueryFunction<false, false> | { (arg0: any): any; query: (arg0: string) => any; };

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set.');
    }
    this.sql = neon(String(process.env.DATABASE_URL));
    console.log('Database connection initialized.');
  }

  onModuleDestroy() {
    console.log('Database service destroyed (connection likely still pooled).');
  }

  async runQuery(query: string) {
    console.log(query);
    try {
      const result = await this.sql.query(query);
      return result;
    } catch (error) {
      console.error('Error executing query:', error);
      console.error('Failed Query Object:', query);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }
}