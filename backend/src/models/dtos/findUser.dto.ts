import { AttributeEntity } from "../entities/attribute.entity";

export class FindUserDTO {
    email?: string;
    name?: string;
    attributes: string[] = [];
    matchAllAttributes: boolean = false;
}