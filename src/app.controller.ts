import { Controller, Get } from '@nestjs/common';
import { IsPublic } from './core/decorators/IsPublic';

@IsPublic()
@Controller()
export class AppController {
  @Get('healthcheck')
  healthcheck(): void { return }
}
