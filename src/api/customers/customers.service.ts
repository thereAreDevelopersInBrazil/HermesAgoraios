import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ACustomersRepository } from 'src/core/repositories/abstracts/acustomers.repository';
import { Customer } from '../orders/entities/customer.entity';
import { IdParamDto } from 'src/core/dto/id-param.dto';

@Injectable()
export class CustomersService {
  constructor(protected readonly repo: ACustomersRepository) { }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const result = await this.repo.create(createCustomerDto);
    return Customer.fromRaw(result);
  }

  async findAll(): Promise<Customer[]> {
    return await this.repo.findAll();
  }

  async findOne(id: IdParamDto): Promise<Customer> {
    return await this.repo.findOne(id.id);
  }

}
