import { Module } from '@nestjs/common';
import { ProductsStreamService } from './products-stream.service';
import { ProductsStreamGateway } from './products-stream.gateway';

@Module({
  providers: [ProductsStreamGateway, ProductsStreamService],
})
export class ProductsStreamModule {}
