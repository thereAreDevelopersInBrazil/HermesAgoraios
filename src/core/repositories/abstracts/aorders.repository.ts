import { CreateOrderDto } from "src/api/orders/dto/create-order-dto.";
import { APrismaRepository } from "./aprisma.repository";
import { PrismaService } from "src/core/services/prisma.service";
import { Order } from "src/api/orders/entities/order.entity";
import { UpdateOrderDto } from "src/api/orders/dto/update-order.dto";
import { FindAllOrdersDto } from "src/api/orders/dto/find-all-orders.dto";

export abstract class AOrdersRepository extends APrismaRepository {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma);
    }
    abstract create(data: CreateOrderDto): Promise<Order>;
    abstract update(id: number, data: UpdateOrderDto): Promise<Order>;
    abstract findOne(id: number): Promise<Order>;
    abstract findAll(data: FindAllOrdersDto): Promise<Order[]>;
}