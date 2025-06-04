import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AOrdersRepository } from 'src/core/repositories/abstracts/aorders.repository';
import { OrdersRepository } from 'src/core/repositories/orders.repository';
import { PrismaService } from 'src/core/services/prisma.service';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    PrismaService,
    {
      provide: AOrdersRepository,
      useClass: OrdersRepository
    }
  ],
})
export class OrdersModule { }
