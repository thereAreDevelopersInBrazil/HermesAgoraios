import { PrismaService } from "src/core/database/prisma.service";

export abstract class APrismaRepository {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService) {
        this.prisma = prisma
    }
}