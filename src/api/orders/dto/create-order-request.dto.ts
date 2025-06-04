import { Type } from "class-transformer";
import { ArrayMinSize, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength, ValidateNested } from "class-validator";
import { IsValidCustomerId } from "src/core/validators/IsValidCustomerId";
import { IsValidProductCode } from "src/core/validators/IsValidProductCode";

export class ItensDto {

    /**
     * Código do produto
     * @example "COD_9_OCV7B"
    */
    @IsNotEmpty({ message: "O código do produto é um campo obrigatório!" })
    @IsString({ message: "O código do produto deve ser um valor textual! Exemplo: COD_9_OCV7B" })
    @MinLength(11, { message: "O código do produto deve conter no mínimo 11 caracteres! Exemplo COD_9_OCV7B" })
    @IsValidProductCode()
    code: string;

    /**
     * Quantidade desejada do produto 
     * @example 3
    */
    @IsNotEmpty({ message: "A quantidade é um campo obrigatório!" })
    @IsInt({ message: "A quantidade deve ser um número inteiro!" })
    @IsPositive({ message: "A quantidade deve ser um número inteiro positivo!" })
    @Min(1, { message: "A quantidade deve ser maior que zero!" })
    quantity: number;

    /**
     * Preço unitário do produto
     * @example 8.99
    */
    @IsNotEmpty({ message: "O preço unitário é um campo obrigatório!" })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 }, { message: "O preço unitário deve ser um número válido de no máximo 2 casas decimais!" })
    @Min(0.01, { message: "O preço unitário deve ser de no mínimo 0.01!" })
    unit_price: number;
}

export class CreateOrderRequestDto {

    /**
     * Id do comprador
     * @example "Natan Souza"
    */
    @IsNotEmpty({ message: "O id do comprador é um campo obrigatório!" })
    @IsInt({ message: "O id do comprador deve ser um número inteiro!" })
    @IsPositive({ message: "O id do comprador deve ser um número inteiro positivo!" })
    @Min(1, { message: "O id do comprador deve ser maior que zero!" })
    @IsValidCustomerId()
    customer_id: number;

    /**
     * Array de Itens do pedido
     * @example [{code: "COD_9_OCV7B", quantity: 2, price: 8.99}]
    */
    @IsNotEmpty({ message: "O envio dos itens do pedido é obrigatório!" })
    @ArrayMinSize(1, { message: 'O pedido deve conter pelo menos um item!' })
    @ValidateNested({ each: true })
    @Type(() => ItensDto)
    itens: ItensDto[]

    /**
     * Referencia externa ao pedido caso este tenha sido espelhado de outro sistema, marketplace ou importado de um csv
     * @example 785 
     * @example ORDER-02134
     * @example f78f02ac-d685-40e1-8ad0-884c8bb30fca
    */
    @IsOptional()
    external_ref?: string | null
}
