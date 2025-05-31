import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsModule } from './api/products/products.module';
import { ProductsStreamModule } from './api/products-stream/products-stream.module';
import { OrdersModule } from './api/orders/orders.module';

@Module({
  imports: [ProductsModule, ProductsStreamModule, OrdersModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements OnModuleInit {

  async onModuleInit() {

  }
}
