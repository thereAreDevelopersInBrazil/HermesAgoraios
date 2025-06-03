import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { PrismaService } from 'src/core/database/prisma.service';
import { ACustomersRepository } from 'src/core/repositories/abstracts/acustomers.repository';
import { CustomersRepository } from 'src/core/repositories/customers.repository';

@Module({
  controllers: [CustomersController],
  providers: [
    CustomersService,
    PrismaService,
    {
      provide: ACustomersRepository,
      useClass: CustomersRepository
    }
  ],
})
export class CustomersModule { }
