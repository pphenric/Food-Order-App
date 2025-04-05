import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global() // Make DatabaseService available globally without importing DatabaseModule everywhere
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}