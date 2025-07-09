import { AttributeEntity } from "../entities/attribute.entity";

export class CreateUserDTO {
    email: string;
    name: string;
    attributes: string[] = [];
    password?: string;
}