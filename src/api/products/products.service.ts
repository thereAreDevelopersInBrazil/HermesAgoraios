import { Injectable } from '@nestjs/common';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { AProductsRepository } from 'src/core/repositories/abstracts/aproducts.repository';
import { Product } from './entities/product.entity';
import { IdParamDto } from 'src/core/dto/id-param.dto';

@Injectable()
export class ProductsService {
  constructor(protected readonly repo: AProductsRepository) { }


  async findAll(findAllProductsDto: FindAllProductsDto): Promise<Product[]> {

    const where = {};
    if (findAllProductsDto.code) {
      where['code'] = {
        contains: findAllProductsDto.code
      }
    }
    if (findAllProductsDto.name) {
      where['name'] = {
        contains: findAllProductsDto.name
      }
    }
    const result = await this.repo.findAll(where);
    return result;
  }

  async findOne(id: IdParamDto): Promise<Product> {
    return await this.repo.findOne(id.id);
  }

}
