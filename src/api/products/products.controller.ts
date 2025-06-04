import { Controller, Get, Param, Query, Sse, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { IdParamDto } from 'src/core/dto/id-param.dto';
import { Product } from './entities/product.entity';
import { map, Observable } from 'rxjs';
import { FindAllProductsWithDetailsDto } from './dto/find-all-products-with-details.dto';

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
   * Obter lista de produtos com detalhes (disponibilidade, estoque e ultima compra)
   *
   * @remarks Realiza uma busca e retorna todos dados disponíveis instantâneamente dos produtos de forma imediata
   * e posteriormente complementa os resultados com as informações asincronas de:<br/>
   * - `available` - Disponibilidade (se o produto está ou não disponível)<br/>
   * - `quantity` - Quantidade em estoque<br/>
   * - `lastBuyDate` - Data da ultima compra (Possível obter apenas caso fornecida a querystring `customer_id`)
   * Permite filtros por código do produto ou nome
   *
   * @returns - Streamming the mensagens do tipo `Product`
   * @throws {400} Bad Request - Caso seja enviado um `/:id` de produto inválido
   * @throws {404} Not found - Caso seja enviado um `/:id` de produto inexistente
   * @throws {500} Caso ocorra algum erro interno no serviço
  */
  @Sse('details')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAllWithDetails(
    @Query() findAllProductsWithDetailsDto: FindAllProductsWithDetailsDto,
  ): Promise<Observable<MessageEvent>> {
    const productsObservable = await this.productsService.findAllWithDetails(findAllProductsWithDetailsDto);
    return productsObservable.pipe(
      map((products) => {
        const payload = { products };
        return { data: JSON.stringify(payload) } as MessageEvent;
      }),
    );
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
