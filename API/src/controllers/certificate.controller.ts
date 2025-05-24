/* eslint-disable prettier/prettier */
import { Controller, Get, HttpStatus, Param, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as XLSX from 'xlsx';
import * as archiver from 'archiver';
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

     @Post('lote')
  @UseInterceptors(FileInterceptor('file'))
  async gerarCertificadosEmLote(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const dados = XLSX.utils.sheet_to_json(sheet);
      const nomes = dados.map((item: any) => item.nome || item.Nome || item.NOME);

      if (!nomes.length) {
        return res.status(HttpStatus.BAD_REQUEST).send({
          message: 'Planilha vazia ou sem coluna "nome".',
        });
      }

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename=certificados.zip');

      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      archive.on('error', (err) => {
        throw err;
      });

      archive.pipe(res);

      for (const nome of nomes) {
        const buffer = await this.certificadoService.gerarCertificado(nome);
        archive.append(buffer, { name: `Certificado_${nome}.pdf` });
      }

      await archive.finalize();
    } catch (error) {
      console.error('❌ Erro ao gerar certificados em lote:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Erro ao gerar certificados em lote.',
      });
    }
  }
    


    @Get('/verificapresenca')
    async getPresenca(@Query('email') usuarioEmail: string) {
        return this.certificadoService.getPresenca(usuarioEmail);
    }


}
