import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/core/services/prisma.service';
import { AProductsRepository } from 'src/core/repositories/abstracts/aproducts.repository';
import { ProductsRepository } from 'src/core/repositories/products.repository';
import { HttpModule } from '@nestjs/axios';
import { CacheService } from 'src/core/services/cache.service';
import { LimiterService } from 'src/core/services/rate-limiter.service';

@Module({
  imports: [HttpModule],
  controllers: [ProductsController],
  providers: [
    PrismaService,
    CacheService,
    LimiterService,
    ProductsService,
    {
      provide: AProductsRepository,
      useClass: ProductsRepository
    }
  ],
})
export class ProductsModule { }
