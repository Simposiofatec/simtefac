import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { create } from 'domain';
import { find, race } from 'rxjs/operators';
import { CreateUserDTO } from 'src/models/dtos/createUser.dto';
import { FindUserDTO } from 'src/models/dtos/findUser.dto';
import { SetParameterDTO } from 'src/models/dtos/setParameter.dto';
import { UpdateUserDTO } from 'src/models/dtos/updateUser.dto';
import { AttributeEntity } from 'src/models/entities/attribute.entity';
import { ParameterEntity } from 'src/models/entities/parameter.entity';
import { UserEntity } from 'src/models/entities/user.entity';
import { eError } from 'src/models/errors';
import { Any, FindOperator, FindOptionsWhere, In, Raw, Repository } from 'typeorm';

@Injectable()
export class ParameterService {
    constructor(@InjectRepository(ParameterEntity) private parameterRepository: Repository<ParameterEntity>) { }

    async getAll(): Promise<ParameterEntity> {
        const parameters = this.parameterRepository.findOne({ where: { version: process.env.API_VERSION } });

        return parameters;
    }

    async setParameter(setParameterDTO: SetParameterDTO) {
        let parameters: ParameterEntity = await this.getAll();

        if (!parameters)
            parameters = { version: process.env.API_VERSION } as ParameterEntity;

        parameters[setParameterDTO.name] = setParameterDTO.value;

        this.parameterRepository.save(parameters);
    }
}
