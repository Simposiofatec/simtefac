import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { AttributeEntity } from 'src/models/entities/attribute.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector, private jwtService: JwtService) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const authorizedAttributes: string[] | string = this.reflector.get('AuthorizedAttributes', context.getHandler());

        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const token = this.extractTokenFromHeader(request);

        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_KEY,
            });

            request.user = payload;

            if (!authorizedAttributes || authorizedAttributes.length == 0) {
                return true;
            }

            const userAttributes: string[] = request.user.attributes.map((attribute: AttributeEntity) => attribute.id);
            const bIsAuthorized: boolean = !authorizedAttributes || authorizedAttributes.length == 0 || userAttributes.some(userAttribute => authorizedAttributes.includes(userAttribute)) || authorizedAttributes === '*';

            if (!bIsAuthorized)
                response.status(HttpStatus.FORBIDDEN);

            return bIsAuthorized;
        }
        catch {
            if (!authorizedAttributes || authorizedAttributes.length == 0) {
                return true;
            }

            response.status(HttpStatus.UNAUTHORIZED);
            response.send();
            return false;
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authorizationHeader = request.headers['authorization'] ?? '';
        const [bearer, token] = authorizationHeader.split(' ');
        return token;
    }
}

