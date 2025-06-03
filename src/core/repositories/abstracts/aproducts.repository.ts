import { Product } from "src/api/products/entities/product.entity";
import { APrismaRepository } from "./aprisma.repository";
import { PrismaService } from "src/core/database/prisma.service";

export abstract class AProductsRepository extends APrismaRepository {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma);
    }
    abstract findOne(id: number): Promise<Product>;
    abstract findAll(where: object): Promise<Product[]>;
}