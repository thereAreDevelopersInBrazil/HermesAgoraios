import { IntersectionType } from "@nestjs/swagger";
import { CreateOrderRequestDto } from "./create-order-request.dto";
import { IsDateString, IsNotEmpty, IsNumber, Min } from "class-validator";

export class AdditionalOrderInfoDto {
    /**
     * Total do pedido
     * @example 207.93
    */
    @IsNotEmpty({ message: "O total do pedido é um campo obrigatório!" })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 }, { message: "O total do pedido deve ser um número válido de no máximo 2 casas decimais!" })
    @Min(0.01, { message: "O total do pedido deve ser de no mínimo 0.01!" })
    public readonly total: number;

    /**
     * Data de entrega estimada
     * @example "2025-06-02T04:33:12.982Z"
    */
    @IsNotEmpty({ message: "A data de entrega estimada é um campo obrigatório!" })
    @IsDateString({ strict: false, strictSeparator: false }, { message: "A data de entrega estimada deve ser uma string no formato ISO 8601!" })
    public readonly estimated_delivery_at: Date;
}

export class CreateOrderDto extends IntersectionType(
    CreateOrderRequestDto,
    AdditionalOrderInfoDto
) { }