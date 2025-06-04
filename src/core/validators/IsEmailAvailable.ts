import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@ValidatorConstraint({ name: 'IsEmailAvailable', async: true })
@Injectable()
export class IsEmailAvailableConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prismaService: PrismaService) { }

    async validate(email: string): Promise<boolean> {
        const customer = await this.prismaService.customers.findUnique({
            where: {
                email: email
            }
        });
        if (customer && customer.id) {
            return false;
        }

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `O Email ${args.value} já está em uso! Utilize o cadastro já existente ou se cadastre utilizando um email diferente!`;
    }
}

export function IsEmailAvailable(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailAvailableConstraint,
        });
    };
}