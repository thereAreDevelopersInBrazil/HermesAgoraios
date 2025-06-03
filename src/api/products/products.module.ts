import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/core/database/prisma.service';
import { AProductsRepository } from 'src/core/repositories/abstracts/aproducts.repository';
import { ProductsRepository } from 'src/core/repositories/products.repository';

@Module({
  controllers: [ProductsController],
  providers: [
    PrismaService,
    ProductsService,
    {
      provide: AProductsRepository,
      useClass: ProductsRepository
    }
  ],
})
export class ProductsModule { }
