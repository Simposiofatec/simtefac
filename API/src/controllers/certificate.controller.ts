/* eslint-disable prettier/prettier */
import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { CertificateService } from 'src/services/certificate.service';

@Controller('certificate') // A rota base para certificados
export class CertificateController {
    constructor(private readonly certificadoService: CertificateService) {}

    @Get('certificado/:nome')
    async getCertificado(@Res() res: Response, @Param('nome') nome: string) {
        try {
            const buffer = await this.certificadoService.gerarCertificado(nome);
    
            res.setHeader('Content-Disposition', `attachment; filename=Certificado_${nome}.pdf`);
            res.setHeader('Content-Type', 'application/pdf');
    
            res.status(HttpStatus.OK).send(buffer);
        }  catch (error) {
            const message =
            error?.message ?? 'Erro inesperado ao gerar certificado';

        console.error('❌ Erro ao gerar certificado:', error);

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: `Erro ao gerar certificado: ${message}`,
        });
    }
    }
    


    @Get('/verificapresenca')
    async getPresenca(@Query('email') usuarioEmail: string) {
        return this.certificadoService.getPresenca(usuarioEmail);
    }


}
