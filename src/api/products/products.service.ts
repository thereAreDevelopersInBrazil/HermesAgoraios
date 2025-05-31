import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto'
import { PrismaService } from 'src/core/database/prisma.service';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(protected readonly prismaService: PrismaService) { }


  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }




}
