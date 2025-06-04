import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsModule } from './api/products/products.module';
import { OrdersModule } from './api/orders/orders.module';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaService } from './core/services/prisma.service';
import { CustomersModule } from './api/customers/customers.module';
import { IsEmailAvailableConstraint } from './core/validators/IsEmailAvailable';
import { IsValidCustomerIdConstraint } from './core/validators/IsValidCustomerId';
import { IsValidProductCodeConstraint } from './core/validators/IsValidProductCode';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './core/guards/AuthGuard';
import { CacheService } from './core/services/cache.service';

@Module({
  imports: [
    ProductsModule,
    CustomersModule,
    OrdersModule,
    CacheModule.register({
      ttl: 300,
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    CacheService,
    IsEmailAvailableConstraint,
    IsValidCustomerIdConstraint,
    IsValidProductCodeConstraint,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
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
