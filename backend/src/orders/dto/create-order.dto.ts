import { IsString, IsNotEmpty, IsEmail, IsNumber, MinLength, IsJSON } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name cannot be empty' })
  @MinLength(3, { message: 'Full name must be at least 3 characters long' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Street cannot be empty' })
  @MinLength(3, { message: 'Street must be at least 3 characters long' })
  street: string;

  @IsString()
  @IsNotEmpty({ message: 'Postal code cannot be empty' })
  @MinLength(3, { message: 'Postal code must be at least 3 characters long' })
  postalcode: string;

  @IsString()
  @IsNotEmpty({ message: 'City cannot be empty' })
  @MinLength(3, { message: 'City must be at least 3 characters long' })
  city: string;

  @IsNumber({}, { message: 'Price total must be a number' })
  @IsNotEmpty({ message: 'Price total is required' })
  pricetotal: number;

  @IsString()
  @IsJSON({ message: 'Cart details must be a valid JSON string' })
  @IsNotEmpty({ message: 'Cart details cannot be empty' })
  cartdetails: string;
}