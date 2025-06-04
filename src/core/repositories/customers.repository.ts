import { PrismaService } from "../services/prisma.service";
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { ACustomersRepository } from "./abstracts/acustomers.repository";
import { Customer } from "src/api/orders/entities/customer.entity";
import { CreateCustomerDto } from "src/api/customers/dto/create-customer.dto";

@Injectable()
export class CustomersRepository extends ACustomersRepository {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma);
    }

    async create(createCustomerDto: CreateCustomerDto) {
        const result = await this.prisma.customers.create({
            data: {
                name: createCustomerDto.name,
                email: createCustomerDto.email
            }
        });

        if (!result) {
            throw new HttpException(`Não foi possível detectar se o consumidor foi inserido com sucesso!`, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return result;
    }
    async findOne(id?: number, email?: string): Promise<Customer> {
        const where = {};
        if (id) {
            where['id'] = id;
        }
        if (email) {
            where['email'] = email;
        }
        const result = await this.prisma.customers.findFirst({
            where: where
        });

        if (!result) {
            throw new NotFoundException(`Não foram encontrados consumidores com o id fornecido (#${id})!`);
        }

        return Customer.fromRaw(result);
    }

    async findAll(): Promise<Customer[]> {
        const result = await this.prisma.customers.findMany();

        if (result && Array.isArray(result) && result.length > 0) {
            return Customer.fromRawArray(result);
        }

        return [];
    }

}