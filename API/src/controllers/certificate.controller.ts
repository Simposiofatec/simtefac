/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserEntity } from 'src/models/entities/user.entity';
import { CertificateService } from 'src/services/certificate.service';

@Controller('certificate') // A rota base para certificados
export class CertificateController {
    constructor(private readonly certificadoService: CertificateService) {}

    @Get('/certificado') // Sem a necessidade de eventId
    async getCertificado(@Res() res: Response) {
        try {
            const fileBuffer = await this.certificadoService.retornaCertificado(); // Chama o serviço para pegar o certificado

            res.setHeader('Content-Disposition', 'attachment; filename=Certificado.docx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

            res.status(HttpStatus.OK).send(fileBuffer); // Retorna o arquivo
        } catch (error) {
            const response = {
                message: 'Erro ao obter o certificado. Verifique se o certificado está disponível.'
            };

            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response);
        }
    }


    @Get('/verificapresenca')
    async getPresenca(@Query('email') usuarioEmail: string) {
        return this.certificadoService.getPresenca(usuarioEmail);
    }


}
