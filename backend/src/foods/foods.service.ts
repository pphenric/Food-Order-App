import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { FoodItem } from 'src/interfaces/interfaces';

@Injectable()
export class FoodsService {
  // Inject DatabaseService
  constructor(private dbService: DatabaseService) {}

  async findAll(): Promise<FoodItem[]> {
    try {
      const query = 'SELECT * FROM foods';
      const data = await this.dbService.runQuery(query);
      return data;
    } catch (error) {
        console.error('Failed to fetch foods:', error);
        throw new InternalServerErrorException('Could not fetch food data.');
    }
  }
}