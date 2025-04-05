import { Controller, Get } from '@nestjs/common';
import { FoodsService } from './foods.service';

@Controller('foods') // Route prefix: /foods
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get() // Handles GET requests to /foods
  async findAll() {
    try {
      const data = await this.foodsService.findAll();
      return { success: true, data };
    } catch (error) {
        console.error(`Error in GET /foods: ${error.message}`)
        throw error;
    }
  }
}