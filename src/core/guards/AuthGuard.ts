
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AUTHORIZED_USER_TOKEN } from '../constants/auth';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/IsPublic';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const IsPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (IsPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.getToken(request);
        if (!token) {
            throw new UnauthorizedException("Usuário não esta logado para realizar esta ação! Efetue login e tente novamente!");
        }
        if (token != AUTHORIZED_USER_TOKEN) {
            throw new UnauthorizedException("Token expirado ou inválido! Efetue login e tente novamente!");
        }
        return true;
    }

    private getToken(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
