/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { SubscriptionEntity } from 'src/models/entities/subscriptions.entity';

@Injectable()
export class CertificateService {
    constructor(
        @InjectRepository(SubscriptionEntity)
        private subscriptionRepository: Repository<SubscriptionEntity>
    ) { }

    async retornaCertificado(): Promise<Buffer> {
        const filePath = path.resolve(__dirname, '../../file/Certificado.docx');

        try {
            return fs.promises.readFile(filePath);
        } catch (error) {
            throw new Error(`Erro ao carregar o certificado: ${error.message}`);
        }
    }

    async getPresenca(userEmail: string): Promise<number> {
        const inscricoes = await this.subscriptionRepository.find({
            where: {
                userEmail: userEmail,
                exit: Not(IsNull())
            },
            relations: [
                'user',    // Relação com a entidade User
                'event'    // Relação com a entidade Event
            ]
        });
        
        if (!inscricoes) { // Se for null ou undefined
            return 0;
        }
        return inscricoes.length;
    }

}

