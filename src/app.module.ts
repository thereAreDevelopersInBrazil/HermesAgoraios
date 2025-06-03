import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsModule } from './api/products/products.module';
import { ProductsStreamModule } from './api/products-stream/products-stream.module';
import { OrdersModule } from './api/orders/orders.module';
import { PrismaService } from './core/database/prisma.service';
import { CustomersModule } from './api/customers/customers.module';
import { IsEmailAvailableConstraint } from './core/validators/IsEmailAvailable';
import { IsValidCustomerIdConstraint } from './core/validators/IsValidCustomerId';
import { IsValidProductCodeConstraint } from './core/validators/IsValidProductCode';

@Module({
  imports: [ProductsModule, ProductsStreamModule, CustomersModule, OrdersModule],
  controllers: [AppController],
  providers: [
    PrismaService,
    IsEmailAvailableConstraint,
    IsValidCustomerIdConstraint,
    IsValidProductCodeConstraint
  ],
  exports: [
    IsEmailAvailableConstraint,
    IsValidCustomerIdConstraint,
    IsValidProductCodeConstraint
  ]
})
export class AppModule implements OnModuleInit {

  async onModuleInit() {

  }
}
