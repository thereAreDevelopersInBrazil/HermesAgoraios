import { Transform } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";
import { IsValidCustomerId } from "src/core/validators/IsValidCustomerId";
import { FindAllProductsDto } from "./find-all-products.dto";
import { IntersectionType } from "@nestjs/swagger";

export class FindAllProductsWithDetailsDto extends IntersectionType(
    FindAllProductsDto
) {

    /**
     * Querystring permite identificar o consumidor que esta realizando a busca, caso informada, permite obter a data de ultima compra do produto pelo consumidor caso houver
     * @example 7
    */
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt({ message: "Caso informado, o customer_id (Id do comprador) deve ser um número inteiro!" })
    @Min(1, { message: "Caso informado, o customer_id (Id do comprador) deve ser maior que zero!" })
    @IsValidCustomerId()
    customer_id: number;
}
