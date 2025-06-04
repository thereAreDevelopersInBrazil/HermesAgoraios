import { PrismaService } from "../services/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { AProductsRepository } from "./abstracts/aproducts.repository";
import { Product } from "src/api/products/entities/product.entity";
import { FindAllProductsDto } from "src/api/products/dto/find-all-products.dto";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class ProductsRepository extends AProductsRepository {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma);
    }

    async findOne(id: number): Promise<Product> {
        const result = await this.prisma.products.findFirst({
            where: {
                id: id,
            }
        });

        if (!result) {
            throw new NotFoundException(`Não foram encontrados produtos com o id fornecido (#${id})!`);
        }

        return Product.fromRaw(result);
    }

    async findAll(where: object): Promise<Product[]> {

        const result = await this.prisma.products.findMany({ where });

        if (result && Array.isArray(result) && result.length > 0) {
            return Product.fromRawArray(result);
        }

        return [];
    }

}