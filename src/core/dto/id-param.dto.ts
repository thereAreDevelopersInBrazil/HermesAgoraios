import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Id requerido, número inteiro maior que zero
 * @example 7
 */
export class IdParamDto {
    @Type(() => Number)
    @IsInt({ message: "O parametro :id deve ser um número inteiro!" })
    @Min(1, {message: "O parametro :id deve ser maior que zero!"})
    id: number;
}