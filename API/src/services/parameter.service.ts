/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { SetParameterDTO } from 'src/models/dtos/setParameter.dto';
import { ParameterEntity } from 'src/models/entities/parameter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParameterService {
    constructor(@InjectRepository(ParameterEntity) private parameterRepository: Repository<ParameterEntity>) { }

    async getAll(): Promise<ParameterEntity> {
        const parameters = this.parameterRepository.findOne({ where: { version: process.env.API_VERSION } });

        return parameters;
    }

async create(parametros: SetParameterDTO) {
  // Primeiro tenta buscar os parâmetros da versão atual
  const existingParams = await this.parameterRepository.findOne({ where: { version: process.env.API_VERSION } });

  if (!existingParams) {
    // Se não existe, cria um novo
    const newParams = this.parameterRepository.create({
      ...parametros,
      version: process.env.API_VERSION,
    });

    await this.parameterRepository.save(newParams);
  } else {
    // Se já existe, atualiza os campos
    Object.assign(existingParams, parametros);

    // Garante que a versão está correta (pode manter ou sobrescrever)
    existingParams.version = process.env.API_VERSION;

    await this.parameterRepository.save(existingParams);
  }
}
    async setParameter(setParameterDTO: SetParameterDTO) {
        let parameters: ParameterEntity = await this.getAll();

        if (!parameters)
            parameters = { version: process.env.API_VERSION } as ParameterEntity;

        parameters[setParameterDTO.name] = setParameterDTO.value;

        this.parameterRepository.save(parameters);
    }
}
