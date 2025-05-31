import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsStreamService {

  findOne(id: string) {
    return `This action returns a #${id} productsStream`;
  }

}
