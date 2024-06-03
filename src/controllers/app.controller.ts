import { Controller, Get, Param} from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello world!';
  }
}
