import { Injectable } from '@nestjs/common';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { AProductsRepository } from 'src/core/repositories/abstracts/aproducts.repository';
import { Product } from './entities/product.entity';
import { IdParamDto } from 'src/core/dto/id-param.dto';
import { HttpService } from '@nestjs/axios';
import { ProductAvailability } from './entities/product-availability.entity';
import { ProductLastBuy } from './entities/product-lastbuy.entity';
import { ReplaySubject, Subject, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { AUTHORIZED_USER_TOKEN } from 'src/core/constants/auth';
import { ProductWithDetails } from './entities/product-with-details.entity';
import { CacheService } from 'src/core/services/cache.service';
import { LimiterService } from 'src/core/services/rate-limiter.service';
import { AxiosResponse } from 'axios';
import { FindAllProductsWithDetailsDto } from './dto/find-all-products-with-details.dto';

@Injectable()
export class ProductsService {
  constructor(
    protected readonly repo: AProductsRepository,
    private readonly httpService: HttpService,
    private readonly limiterService: LimiterService,
    private readonly cacheService: CacheService,
  ) { }

  async findAll(findAllProductsDto: FindAllProductsDto): Promise<Product[]> {
    const where: any = {};
    if (findAllProductsDto.code) {
      where['code'] = { contains: findAllProductsDto.code };
    }
    if (findAllProductsDto.name) {
      where['name'] = { contains: findAllProductsDto.name };
    }
    return this.repo.findAll(where);
  }

  async findAllWithDetails(
    findAllProductsWithDetailsDto: FindAllProductsWithDetailsDto,
  ): Promise<ReplaySubject<ProductWithDetails[]>> {
    const resultStream = new ReplaySubject<ProductWithDetails[]>(1);
    const products = await this.findAll(findAllProductsWithDetailsDto);

    const productsWithDetails = products.map((product) => ({
      ...product,
      available: null,
      quantity: null,
      lastBuyDate: null,
    }));
    console.log('Products with details:', JSON.stringify(productsWithDetails, null, 2));

    resultStream.next(productsWithDetails);

    const allProductsPromises = products.map(async (product) => {
      const availabilityPromise = this.limiterService.run<ProductAvailability | null>(() =>
        this.getAvailability(product.id),
      );
      const lastBuyPromise = this.limiterService.run<ProductLastBuy | null>(() =>
        this.getLastBuy(product.id, findAllProductsWithDetailsDto.customer_id),
      );

      const [availabilityResult, lastBuyResult] = await Promise.all([
        availabilityPromise,
        lastBuyPromise,
      ]);

      resultStream.next([{
        ...product,
        available: availabilityResult ? availabilityResult.available : null,
        quantity: availabilityResult ? availabilityResult.quantity : null,
        lastBuyDate: lastBuyResult ? lastBuyResult.lastBuyDate : null,
      }]);
    });

    Promise.all(allProductsPromises).then(() => resultStream.complete());

    return resultStream;
  }

  async findOne(idParamDto: IdParamDto): Promise<Product> {
    return this.repo.findOne(idParamDto.id);
  }

  async getAvailability(productId: number): Promise<ProductAvailability | null> {
    const cacheKey = `availability:${productId}`;
    const cached = await this.cacheService.getCache<ProductAvailability>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const result = await firstValueFrom(
        this.httpService
          .get(`https://gateway-smartforce.yandeh.com.br/process/candidates/availability/${productId}`, {
            headers: { Token: AUTHORIZED_USER_TOKEN },
          })
          .pipe(map((response: AxiosResponse<ProductAvailability>) => response.data)),
      );
      if (result) {
        await this.cacheService.setCache<ProductAvailability>(cacheKey, result);
        return result
      }
    } catch (error) {
      console.log('Erro ao acessar api externa de consulta de disponibilidade, detalhes:', error);
      return null;
    }

    return null;
  }

  async getLastBuy(productId: number, customerId: number): Promise<ProductLastBuy | null> {
    const cacheKey = `lastbuy:${productId}`;
    const cached = await this.cacheService.getCache<ProductLastBuy>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const result = await firstValueFrom(
        this.httpService
          .get(`https://gateway-smartforce.yandeh.com.br/process/candidates/lastbuy/${customerId}/${productId}`, {
            headers: { Token: AUTHORIZED_USER_TOKEN },
          })
          .pipe(map((response: AxiosResponse<ProductLastBuy>) => response.data)),
      );
      if (result) {
        await this.cacheService.setCache<ProductLastBuy>(cacheKey, result);
        return result
      }
    } catch (error) {
      console.log('Erro ao acessar api externa de consulta de data de ultima compra, detalhes:', error);
      return null;
    }

    return null;
  }
}