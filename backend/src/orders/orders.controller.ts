import { Controller, Post, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders') // Route prefix: /orders
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  // Use ValidationPipe to automatically validate the incoming body against CreateOrderDto
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createOrderDto: CreateOrderDto) {
     try {
        const result = await this.ordersService.create(createOrderDto);
        return { success: true, data: result };
      } catch (error) {
         console.error(`Error in POST /orders: ${error.message}`)
         throw error;
      }
  }
}