import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderRequestDto, ItensDto } from './dto/create-order-request.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { CreateOrdersByCsvDto } from './dto/create-orders-by-csv.dto';
import { AOrdersRepository } from 'src/core/repositories/abstracts/aorders.repository';
import { IdParamDto } from 'src/core/dto/id-param.dto';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order-dto.';
import { ValidationError, Validator } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class OrdersService {
  protected readonly weekDays = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];
  protected readonly csvDictionary = {
    order_id: 0,
    customer_id: 1,
    item_code: 2,
    item_quantity: 3,
    item_unit_price: 4
  }
  constructor(protected readonly repo: AOrdersRepository) { }

  async create(createOrderRequestDto: CreateOrderRequestDto): Promise<Order> {
    const filledOrder: CreateOrderDto = {
      ...createOrderRequestDto,
      estimated_delivery_at: this.getEstimatedDeliveryDate(),
      total: this.getTotal(createOrderRequestDto.itens),
    };
    return this.repo.create(filledOrder);
  }

  async createByCsv(orders: Express.Multer.File) {
    const content = orders.buffer.toString('utf8');
    const lines = content.split("\n");
    if (lines.length < 2) {
      throw new BadRequestException(`O arquivo de importação de pedidos deve conter no mínimo 2 linhas, sendo a primeira linha o cabeçalho de identificação dos campos deve conter no mínimo 1 linha adicional representando dados de no mínimo 1 pedido!`);
    }
    const createOrdersDtosMap = new Map<string, CreateOrderRequestDto>();
    const warnings = new Map<string, string[]>();
    // Comecei do 1 propositalmente para pular a linha de titulos sem alterar o contador de linhas pois sera usado para warnings
    for (let i = 1; i < lines.length; i++) {
      const result = this.getOrderDtoByCsvLine(i, lines[i]);
      if (typeof result === 'string') {
        warnings.set(`Linha ${i}`, [result]);
        continue;
      }
      const orderDto = createOrdersDtosMap.get(result.order_id);
      if (orderDto) {
        orderDto.itens.push({
          code: result.item_code,
          quantity: result.item_quantity,
          unit_price: result.item_unit_price
        })
      } else {
        createOrdersDtosMap.set(result.order_id, {
          customer_id: result.customer_id,
          external_ref: result.order_id,
          itens: [{
            code: result.item_code,
            quantity: result.item_quantity,
            unit_price: result.item_unit_price
          }]
        });
      }
    }

    const promises = Array.from(createOrdersDtosMap.entries()).map(async ([order, createOrderDto]) => {
      try {
        const validator = new Validator();
        const dto = plainToClass(CreateOrderRequestDto, createOrderDto);
        const errors = await validator.validate(dto);
        if (errors.length == 0) {
          return await this.create(createOrderDto);
        } else {
          const errorsMessages = this.extractErrorMessages(errors);
          warnings.set(order, errorsMessages);
        }
      } catch (error) {
        if (error?.message && typeof error?.message == 'string') {
          const fullMessage = `Erro ao processar pedido ${order} - Detalhes:\n` + error?.message;
          warnings.set(order, [fullMessage]);
        } else if (error?.message && Array.isArray(error.message)) {
          warnings.set(order, error.message);
        } else {
          warnings.set(order, [JSON.stringify(error.message)]);
        }
      }
    });

    const createdOrders = await Promise.all(promises);
    const filteredOrders = createdOrders.filter(order => {
      return order != null;
    })
    return {
      orders: filteredOrders,
      warnings: Array.from(warnings)
    };
  }

  async findAll(findAllOrdersDto: FindAllOrdersDto): Promise<Order[]> {
    return await this.repo.findAll(findAllOrdersDto);
  }

  async findOne(idDto: IdParamDto): Promise<Order> {
    return await this.repo.findOne(idDto.id);
  }

  async update(idDto: IdParamDto, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.repo.findOne(idDto.id);
    return await this.repo.update(idDto.id, updateOrderDto);
  }

  private getEstimatedDeliveryDate(reference: Date = new Date()): Date {
    const weekDay = this.weekDays[reference.getDay()];
    const oneDayInMs = 86400 * 1000;

    let daysToAdd: number;
    if (['SEGUNDA', 'TERÇA', 'QUARTA'].includes(weekDay)) {
      daysToAdd = 3;
    } else if (weekDay === 'QUINTA' && reference.getHours() <= 13) {
      daysToAdd = 4;
    } else {
      daysToAdd = 5;
    }

    const estimatedDate = new Date(reference.getTime() + (daysToAdd * oneDayInMs));
    return estimatedDate;
  }

  private getTotal(itens: ItensDto[]): number {
    return itens.reduce((accumulator: number, item: ItensDto) => {
      return Number((accumulator + item.unit_price).toFixed(2));
    }, 0);
  }

  private getOrderDtoByCsvLine(lineNumber: number, line: string): CreateOrdersByCsvDto | string {
    const properties = line.split(",");
    if (properties.length !== 5) {
      return `Linha ${lineNumber} - Linha fora do formato correto, é esperado que o CSV contenha 5 colunas (valores separados por virgulas) e foram encontrados ${properties.length}`
    }

    return {
      order_id: properties[this.csvDictionary.order_id],
      customer_id: Number(properties[this.csvDictionary.customer_id]),
      item_code: properties[this.csvDictionary.item_code],
      item_quantity: Number(properties[this.csvDictionary.item_quantity]),
      item_unit_price: Number(properties[this.csvDictionary.item_unit_price])
    }
  }

  private extractErrorMessages(errors: ValidationError[], prefix: string = ''): string[] {
    const messages: string[] = [];

    for (const error of errors) {
      const currentPrefix = prefix ? `${prefix}.${error.property}` : error.property;

      if (error.constraints) {
        Object.values(error.constraints).forEach(message => {
          messages.push(`${currentPrefix}: ${message}`);
        });
      }

      if (error.children && error.children.length > 0) {
        messages.push(...this.extractErrorMessages(error.children, currentPrefix));
      }
    }

    return messages;
  }
}