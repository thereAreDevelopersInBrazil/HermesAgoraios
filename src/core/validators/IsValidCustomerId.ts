import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@ValidatorConstraint({ name: 'IsValidCustomerId', async: true })
@Injectable()
export class IsValidCustomerIdConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prismaService: PrismaService) { }

    async validate(id: number): Promise<boolean> {
        if (!id || isNaN(id) || id < 0) {
            return false;
        }
        const customer = await this.prismaService.customers.findUnique({
            where: {
                id: id
            }
        });
        if (customer && customer.id) {
            return true;
        }

        return false;
    }

    defaultMessage(args: ValidationArguments) {
        return `Não foram encontrados consumidores com o customer_id fornecido (#${args.value}), verifique e tente novamente!`;
    }
}

export function IsValidCustomerId(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidCustomerIdConstraint,
        });
    };
}