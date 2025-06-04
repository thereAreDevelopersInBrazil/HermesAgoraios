import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@ValidatorConstraint({ name: 'IsValidProductCode', async: true })
@Injectable()
export class IsValidProductCodeConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prismaService: PrismaService) { }

    async validate(code: string): Promise<boolean> {
        const products = await this.prismaService.products.findFirst({
            where: {
                code: code
            }
        });
        if (products && products.id) {
            return true;
        }

        return false;
    }

    defaultMessage(args: ValidationArguments) {
        return `Não foram encontrados produtos com o código (${args.value}), verifique e tente novamente!`;
    }
}

export function IsValidProductCode(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidProductCodeConstraint,
        });
    };
}