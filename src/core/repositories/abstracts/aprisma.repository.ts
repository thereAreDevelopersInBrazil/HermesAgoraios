import { PrismaService } from "src/core/services/prisma.service";

export abstract class APrismaRepository {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService) {
        this.prisma = prisma
    }
}