import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { IsEmailAvailable } from "src/core/validators/IsEmailAvailable";

export class CreateCustomerDto {

    /**
     * Nome do consumidor
     * @example "Natanael"
    */
    @IsNotEmpty({ message: "O nome do consumidor é um campo obrigatório!" })
    @IsString({ message: "O nome do consumidor deve ser um valor textual! Exemplo: `Natanael`" })
    @MinLength(3, { message: "O nome do consumidor deve conter no mínimo 3 caracteres! Exemplo `Natanael`" })
    public readonly name: string;

    /**
     * Email do consumidor
     * @example "natanael@email.com"
    */
    @IsNotEmpty({ message: "O email do consumidor é um campo obrigatório!" })
    @IsString({ message: "O email do consumidor deve ser um valor textual! Exemplo: `natanael@email.com`" })
    @IsEmail({}, { message: "Por favor verifique se o email informado está em um formato valido!" })
    @MinLength(6, { message: "O email do consumidor deve conter no mínimo 6 caracteres! Exemplo `a@b.cd`" })
    @IsEmailAvailable()
    public readonly email: string;
}
