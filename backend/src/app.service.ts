import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  greetUser(): string {
    return 'Hello! Nest.js backend server started succesfully';
  }
}
