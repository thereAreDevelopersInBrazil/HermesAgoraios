import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { IdParamDto } from 'src/core/dto/id-param.dto';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  /**
   * Obter lista de produtos
   *
   * @remarks Realiza uma busca e retorna todos dados disponíveis instantâneamente dos produtos
   * Permite filtros por código do produto ou nome
   *
   * @throws {400} Bad Request - Caso seja enviada uma querystring `code` ou `name` com valores invalidos
   * @throws {500} Caso ocorra algum erro interno no serviço
  */
  @Get()
  async findAll(@Query() findAllProducts: FindAllProductsDto): Promise<Product[]> {
    return await this.productsService.findAll(findAllProducts);
  }

  /**
   * Obter produto especifico
   *
   * @remarks Obtem os dados do produto com Id especificado no parametro `/:id`
   *
   * @throws {400} Bad Request - Caso seja enviado um `/:id` de produto inválido
   * @throws {404} Not found - Caso seja enviado um `/:id` de produto inexistente
   * @throws {500} Caso ocorra algum erro interno no serviço
  */
  @Get(':id')
  async findOne(@Param() id: IdParamDto): Promise<Product> {
    return await this.productsService.findOne(id);
  }
}
