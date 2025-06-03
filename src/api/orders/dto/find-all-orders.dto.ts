import { Transform } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";
import { IsValidCustomerId } from "src/core/validators/IsValidCustomerId";

export class FindAllOrdersDto {

    /**
     * Filtro opcional de busca por pedidos de um determinado consumidor
     * @example 2
    */
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt({ message: "Caso informado, o filtro por id do comprador deve ser um número inteiro!" })
    @Min(1, { message: "Caso informado, o filtro por id do comprador deve ser maior que zero!" })
    @IsValidCustomerId()
    customer_id: number;
}
