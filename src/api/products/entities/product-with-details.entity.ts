import { IntersectionType } from "@nestjs/swagger";
import { Product } from "./product.entity";
import { ProductDetails } from "./product-details.entity";

export class ProductWithDetails extends IntersectionType(
    Product,
    ProductDetails
) {

}
