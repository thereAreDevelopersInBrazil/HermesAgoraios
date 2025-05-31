import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ProductsStreamService } from './products-stream.service';

@WebSocketGateway()
export class ProductsStreamGateway {
  constructor(private readonly productsStreamService: ProductsStreamService) {}

  @SubscribeMessage('products-stream-research')
  findOne(@MessageBody() researchId: string) {
    return this.productsStreamService.findOne(researchId);
  }

}
