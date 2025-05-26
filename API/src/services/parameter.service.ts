/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { SetParameterDTO } from 'src/models/dtos/setParameter.dto';
import { ParameterEntity } from 'src/models/entities/parameter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParameterService {
    constructor(@InjectRepository(ParameterEntity) private parameterRepository: Repository<ParameterEntity>) { }

    /**
     * Busca os parâmetros do sistema para a versão atual da API.
     * @returns Promise que resolve para o objeto ParameterEntity.
     * @throws Error se os parâmetros não forem encontrados.
     */
    async getAll(): Promise<ParameterEntity> {
        const parameters = await this.parameterRepository.findOne({
            where: { version: process.env.API_VERSION },
        });

        if (!parameters) {
            throw new Error('Parameters not found');
        }

        return parameters;
    }

    /**
     * Cria ou atualiza os parâmetros do sistema para a versão atual.
     * Se já existir, atualiza os campos; se não, cria um novo registro.
     * @param parametros - Dados dos parâmetros a serem salvos.
     */
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

    /**
     * Atualiza um parâmetro específico do sistema.
     * @param setParameterDTO - Objeto contendo o nome e valor do parâmetro.
     */
    async setParameter(setParameterDTO: SetParameterDTO) {
        let parameters: ParameterEntity = await this.getAll();

        if (!parameters) parameters = { version: process.env.API_VERSION } as ParameterEntity;

        parameters[setParameterDTO.name] = setParameterDTO.value;

        this.parameterRepository.save(parameters);
    }
}