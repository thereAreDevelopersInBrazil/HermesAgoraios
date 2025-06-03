import { IsOptional, IsString, MinLength } from "class-validator";

export class FindAllProductsDto {

    /**
     * Filtro por nome do produto, irá ser utilizado para uma busca por nomes de produtos que contenham o valor informado
     * @example "Steel"
    */
    @IsOptional()
    @IsString({ message: "Caso seja informado, o filtro por nome do produto ser um valor textual!" })
    @MinLength(3, { message: "Caso seja informado, o filtro por nome do produto deve conter no mínimo 3 caracteres" })
    name?: string;

    /**
     * Filtro por código do produto, irá ser utilizado para uma busca por códigos de produtos que contenham o valor informado
     * @example "COD_"
    */
    @IsOptional()
    @IsString({ message: "Caso seja informado, o filtro por código do produto deve ser um valor textual!" })
    @MinLength(3, { message: "Caso seja informado, o filtro por código do produto deve conter no mínimo 3 caracteres" })
    code?: string;
}
