import { Controller, Get, Post, Body, Patch, Param, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { IdParamDto } from 'src/core/dto/id-param.dto';
import { Order } from './entities/order.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrdersCsv } from './entities/orders-csv.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  /**
   * Cria um pedido para um consumidor
   *
   * @remarks Cria um novo pedido para um consumidor
   *
   * @throws {400} Bad Request - Caso sejam enviados dados incorretos no body da requisição
   * @throws {500} Caso ocorra algum erro interno no serviço
  */
  @Post()
  async create(@Body() createOrderDto: CreateOrderRequestDto): Promise<Order> {
    return await this.ordersService.create(createOrderDto);
  }

  /**
   * Cria pedidos em massa
   *
   * @remarks Cria pedidos em massa a partir do upload de um arquivo csv
   * Espera que seja enviado um campo `orders` em formato csv (comma separated values)<br/>
   * A primeira linha do arquivo deve conter um cabeçalho no formato: `order_id,customer_id,item_code,item_quantity,item_unit_price`<br/>
   * As demais linhas devem ser preenchidas respeitando o formato proposto pelo cabeçalho<br/>
   * Um arquivo template contendo diversos scenarios pode ser encontrado aqui: <a href="https://drive.google.com/file/d/1keKVQNYqbPAqOACflrdMgnIrQKk0Jpvt/view?usp=sharing" target="_blank">orders-sample.csv</a><br/>
   *
   * @throws {400} Bad Request - Caso exista alguma inconsistência que impossibilite completamente a leitura total do arquivo
   * @throws {500} Caso ocorra algum erro interno no serviço
  */
  @Post('/csv')
  @UseInterceptors(FileInterceptor('orders'))
  createByCsv(@UploadedFile() orders: Express.Multer.File) {
    if (!orders || !orders?.originalname || !orders?.mimetype) {
      throw new BadRequestException(`O campo orders é obrigatório e deve ser do tipo file, lembre-se de ajustar seu request para o tipo form-data!`);
    }
    const fileNameExtensions = orders.originalname.split(".");
    const lastExtension = fileNameExtensions.pop();
    if (lastExtension != 'csv') {
      throw new BadRequestException(`A extensão do arquivo a ser enviado no campo orders deve ser .csv, foi recebido um arquivo com extensão .${lastExtension}`);
    }
    if (orders.mimetype != 'text/csv') {
      throw new BadRequestException(`É esperado um arquivo do tipo text/csv, foi recebido um arquivo do tipo ${orders.mimetype}!`);
    }
    return this.ordersService.createByCsv(orders);
  }

  /**
   * Obtem a lista de pedidos
   *
   * @remarks Realiza uma busca e retorna todos consumidores encontrados
   * Permite filtros por consumidor (`customer_id`)
   * @throws {400} Bad Request - Caso seja informado um filtro `customer_id` inválido ou inexistente
   * @throws {500} Caso ocorra algum erro interno no serviço
  */
  @Get()
  async findAll(@Query() findAllOrdersDto: FindAllOrdersDto): Promise<Order[]> {
    return await this.ordersService.findAll(findAllOrdersDto);
  }

  /**
   * Obtem um pedido específico
   *
   * @remarks Retorna um pedido específico com id equivalente ao informano no parâmetro `/:id`
   *
   * @throws {400} Bad Request - Caso seja informado um filtro `customer_id` inválido
   * @throws {404} Not Found - Caso seja informado um filtro `customer_id` inexistente
   * @throws {500} Caso ocorra algum erro interno no serviço
  */
  @Get(':id')
  async findOne(@Param() id: IdParamDto): Promise<Order> {
    return await this.ordersService.findOne(id);
  }

  /**
   * Atualiza o status de um pedido específico
   *
   * @remarks Atualiza o `status` do pedido especificado no parâmetro `/:id` e retorna o pedido após atualização
   *
   * @throws {400} Bad Request - Caso seja informado um `/:id` inválido ou `status` inválido
   * @throws {404} Not Found - Caso seja informado um `/:id` de um pedido inexistente
   * @throws {500} Caso ocorra algum erro interno no serviço
  */
  @Patch(':id/status')
  async update(@Param() idDto: IdParamDto, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return await this.ordersService.update(idDto, updateOrderDto);
  }
}
