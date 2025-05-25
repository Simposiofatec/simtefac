/* eslint-disable prettier/prettier */
import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { CreateUserDTO } from 'src/models/dtos/createUser.dto';
import { FindUserDTO } from 'src/models/dtos/findUser.dto';
import { UpdateUserDTO } from 'src/models/dtos/updateUser.dto';
import { AttributeEntity } from 'src/models/entities/attribute.entity';
import { UserEntity } from 'src/models/entities/user.entity';
import { eError } from 'src/models/errors';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import * as Excel from 'exceljs'
import { emit } from 'process';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>, @InjectRepository(AttributeEntity) private attributeRepository: Repository<AttributeEntity>) { }

    async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
        if (await this.findOne({ email: createUserDTO.email } as FindUserDTO))
            throw eError.USER_ALREADY_EXISTS

        const userAttributes: AttributeEntity[] = await this.attributeRepository.findBy({ id: In(createUserDTO.attributes) });
        const user = { ...createUserDTO, attributes: userAttributes } as UserEntity;
        return this.userRepository.save(user);
    }

    async findOne(findUserDTO: FindUserDTO): Promise<UserEntity> {
        const { attributes, ...findUserDTOWithoutAttributes } = findUserDTO

        let findOptionsWhere: FindOptionsWhere<UserEntity> = {};
        if (findUserDTO.attributes && findUserDTO.attributes.length > 0)
            findOptionsWhere.attributes = findUserDTO.attributes.map(attr => { return { id: attr } });

        if (Object.keys(findUserDTOWithoutAttributes).length > 0)
            findOptionsWhere = { ...findOptionsWhere, ...findUserDTOWithoutAttributes };

        const foundUser = this.userRepository.findOne({
            where: findOptionsWhere,
            relations: [
                'attributes'
            ]
        });

        return foundUser;
    }

    async findMany(findUserDTO: FindUserDTO): Promise<UserEntity[]> {
        const { attributes, matchAllAttributes, ...findUserDTOWithoutAttributes } = findUserDTO

        let findOptionsWhere: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[] = {};

        if (!matchAllAttributes) {
            findOptionsWhere = [];
            if (findUserDTOWithoutAttributes.email)
                findOptionsWhere.push({ email: Like(`%${findUserDTOWithoutAttributes.email}%`) });
            if (findUserDTOWithoutAttributes.name)
                findOptionsWhere.push({ name: Like(`%${findUserDTOWithoutAttributes.name}%`) });
        }
        else {
            if (findUserDTOWithoutAttributes.email)
                findOptionsWhere.email = findUserDTOWithoutAttributes.email;
            if (findUserDTOWithoutAttributes.name)
                findOptionsWhere.name = findUserDTOWithoutAttributes.name;
        }


        const foundUsers = this.userRepository.find({
            where: findOptionsWhere,
            relations: [
                'attributes'
            ]
        });

        return foundUsers;
    }

    async updateUser(updateUserDTO: UpdateUserDTO): Promise<UserEntity> {
        const user: UserEntity = await this.findOne({ email: updateUserDTO.email } as FindUserDTO);

        const userAttributes: AttributeEntity[] = updateUserDTO.attributes ? await this.attributeRepository.findBy({ id: In(updateUserDTO.attributes) }) : user.attributes;

        const updatedUser: UserEntity = { ...user, ...updateUserDTO, attributes: userAttributes } as UserEntity;
        return this.userRepository.save(updatedUser);
    }

async createUsersFromXLSX(xlsxBuffer: Excel.Buffer) {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(xlsxBuffer);

    const worksheet = workbook.getWorksheet(1);
    worksheet.getRow(1).destroy(); // Remove cabeçalho

    const promises: Promise<any>[] = [];

    worksheet.eachRow((row: Excel.Row) => {
        const email = row.getCell(1).value?.toString().trim();
        const name = row.getCell(2).value?.toString().trim();
        const attributesRaw = row.getCell(3).value;

        const attributes = attributesRaw
            ? attributesRaw.toString().split(';').map(attr => attr.trim())
            : [];

        // Validação mínima
        if (!email || !name) {
            console.warn(`Linha ${row.number} inválida. Dados incompletos.`);
            return;
        }

        const createUserDTO: CreateUserDTO = {
            email,
            name,
            attributes
        };

        const promise = this.createUser(createUserDTO)
            .catch(err => {
                console.error(`Erro ao criar usuário ${email}:`, err.message || err);
                // Aqui você pode logar em algum sistema de logs se quiser
            });

        promises.push(promise);
    });

    await Promise.all(promises);

    return { message: 'Importação de usuários finalizada com sucesso.' };
}

    async getCertificado(userEmail: string): Promise<void> {
        const user = await this.userRepository.findOne({
            where: {
                email: userEmail,
            },
        });
    
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
    
        user.gerouCertificado = true;
        
        await this.userRepository.save(user); 
    }
}
