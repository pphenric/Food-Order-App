import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private dbService: DatabaseService) {}

  async create(orderDto: CreateOrderDto): Promise<any> {
    const { name, email, street, postalcode, city, pricetotal, cartdetails } = orderDto;

    const insertQuery = `
      INSERT INTO orders (name, email, street, postalcode, city, pricetotal, cartdetails)
      VALUES ('${name}', '${email}', '${street}', '${postalcode}', '${city}', ${pricetotal}, '${cartdetails}')
      RETURNING id
    `;

    try {
      const result = await this.dbService.runQuery(insertQuery);
      console.log('Order inserted result:', result);
      return result; // Return the result (e.g., the ID)
    } catch (error) {
      console.error('Failed to insert order:', error);
      throw new InternalServerErrorException('Could not save the order.');
    }
  }
}