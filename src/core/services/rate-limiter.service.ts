import { Injectable } from '@nestjs/common';
import pLimit from 'p-limit';

@Injectable()
export class LimiterService {
    private limit: (fn: () => Promise<any>) => Promise<any>;

    constructor() {
        this.limit = pLimit(4);
    }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async run<T>(fn: () => Promise<T>): Promise<T> {
        return this.limit(async () => {
            const result = await fn();
            await this.delay(500);
            return result;
        });
    }
}