import { Injectable } from '@nestjs/common';
import { CreateOrderRequestDto, ItensDto } from './dto/create-order-request.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import { CreateOrdersByCsvDto } from './dto/create-orders-by-csv.dto';
import { AOrdersRepository } from 'src/core/repositories/abstracts/aorders.repository';
import { IdParamDto } from 'src/core/dto/id-param.dto';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order-dto.';

@Injectable()
export class OrdersService {
  protected readonly weekDays = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];
  constructor(protected readonly repo: AOrdersRepository) { }

  async create(createOrderRequestDto: CreateOrderRequestDto): Promise<Order> {
    const filledOrder: CreateOrderDto = {
      ...createOrderRequestDto,
      estimated_delivery_at: this.getEstimatedDeliveryDate(),
      total: this.getTotal(createOrderRequestDto.itens),
    };
    return this.repo.create(filledOrder);
  }

  async createByCsv(createOrdersByCsvDto: CreateOrdersByCsvDto): Promise<string> {
    return new Promise((resolve) => {
      resolve('This create many orders using a uploaded csv file!!!');
    });
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
}