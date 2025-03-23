import { SetMetadata } from "@nestjs/common";

export const AuthorizedAttributes = (roles: string[] | string) => SetMetadata('AuthorizedAttributes', roles);