import { APrismaRepository } from "./aprisma.repository";
import { PrismaService } from "src/core/services/prisma.service";
import { Customer } from "src/api/orders/entities/customer.entity";
import { CreateCustomerDto } from "src/api/customers/dto/create-customer.dto";

export abstract class ACustomersRepository extends APrismaRepository {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma);
    }
    abstract create(createCustomerDto: CreateCustomerDto): Promise<Customer>;
    abstract findOne(id?: number, email?: string): Promise<Customer>;
    abstract findAll(): Promise<Customer[]>;
}