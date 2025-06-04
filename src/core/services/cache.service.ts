import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async setCache<T>(key: string, value: T): Promise<void> {
        await this.cacheManager.set<T>(key, value);
    }

    async getCache<T>(key: string): Promise<T | null> {
        const value = await this.cacheManager.get<T>(key);
        return value ?? null;
    }
}
