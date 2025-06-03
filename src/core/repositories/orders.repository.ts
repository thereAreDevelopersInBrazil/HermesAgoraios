import { PrismaService } from "../database/prisma.service";
import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { AOrdersRepository } from "./abstracts/aorders.repository";
import { CreateOrderDto } from "src/api/orders/dto/create-order-dto.";
import { Order } from "src/api/orders/entities/order.entity";
import { UpdateOrderDto } from "src/api/orders/dto/update-order.dto";
import { FindAllOrdersDto } from "src/api/orders/dto/find-all-orders.dto";

@Injectable()
export class OrdersRepository extends AOrdersRepository {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma);
    }
    async create(data: CreateOrderDto): Promise<Order> {
        const result = await this.prisma.orders.create({
            data: {
                customer_id: data.customer_id,
                total: data.total,
                estimated_delivery_at: data.estimated_delivery_at
            }
        });

        if (!result || !result.id) {
            throw new HttpException("Erro ao identificar o pedido inserido!", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return Order.fromRaw(result);
    }

    async update(id: number, data: UpdateOrderDto): Promise<Order> {
        const result = await this.prisma.orders.update({
            data: data,
            where: {
                id: id
            }
        });

        if (!result) {
            throw new HttpException("Erro ao identificar o pedido atualizado!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return Order.fromRaw(result);
    }

    async findOne(id: number): Promise<Order> {
        const result = await this.prisma.orders.findUnique({
            where: {
                id: id
            }
        });

        if (!result) {
            throw new NotFoundException(`Não foram encontrados pedidos com o id fornecido (#${id})!`);
        }

        return Order.fromRaw(result);
    }

    async findAll(findAllOrdersDto: FindAllOrdersDto): Promise<Order[]> {

        const result = await this.prisma.orders.findMany({
            where: {
                ...findAllOrdersDto
            }
        });

        if (result && Array.isArray(result) && result.length > 0) {
            return Order.fromRawArray(result);
        }

        return [];
    }


}