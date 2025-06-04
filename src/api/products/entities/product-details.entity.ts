import { IntersectionType } from "@nestjs/swagger";
import { ProductAvailability } from "./product-availability.entity";
import { ProductLastBuy } from "./product-lastbuy.entity";

export class ProductDetails extends IntersectionType(
    ProductAvailability,
    ProductLastBuy
) {

}
