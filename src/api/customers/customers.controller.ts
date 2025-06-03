import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { IdParamDto } from 'src/core/dto/id-param.dto';
import { Customer } from './entities/customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  /**
   * Cria um consumidor
   *
   * @remarks Cria um novo consumidor informando seus dados
   *
   * @throws {400} Bad Request - Caso sejam enviados dados incorretos no body da requisição
   * @throws {500} Caso ocorra algum erro interno no serviço
  */
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return await this.customersService.create(createCustomerDto);
  }

  /**
   * Obtem a lista de consumidores
   *
   * @remarks Realiza uma busca e retorna todos consumidores encontrados
   *
   * @throws {500} Caso ocorra algum erro interno no serviço
  */
  @Get()
  async findAll(): Promise<Customer[]> {
    return await this.customersService.findAll();
  }

  /**
   * Obtem um consumidor específico
   *
   * @remarks Retorna o consumidor específico com id equivalente ao informano no parâmetro `/:id`
   *
   * @throws {400} Bad Request - Caso sejam enviado um valor inválido para o parâmetro `/:id`
   * @throws {404} Not Found - Caso o recurso especificado não exista
   * @throws {500} Caso ocorra algum erro interno no serviço
  */
  @Get(':id')
  async findOne(@Param() id: IdParamDto): Promise<Customer> {
    return await this.customersService.findOne(id);
  }
}
