/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { SubscriptionEntity } from 'src/models/entities/subscriptions.entity';
import { exec } from 'child_process';
import * as PizZip from 'pizzip';
import * as Docxtemplater from 'docxtemplater';


@Injectable()
export class CertificateService {
    constructor(
        @InjectRepository(SubscriptionEntity)
        private subscriptionRepository: Repository<SubscriptionEntity>
    ) { }

    async gerarCertificado(nomeUsuario: string): Promise<Buffer> {
        const modeloPath = path.resolve(__dirname, '../../file/Certificado.docx');
        const tempDocxPath = path.resolve(__dirname, `../../file/certificado_${Date.now()}.docx`);
        const tempPdfPath = tempDocxPath.replace('.docx', '.pdf');
    
        // 1. Carrega o template
        const content = fs.readFileSync(modeloPath, 'binary');
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip);
    
        console.log('Substituindo a variável NOME_USUARIO por:', nomeUsuario);
    
        // Substitui a variável
        doc.setData({ NOME_USUARIO: nomeUsuario });
    
        try {
            doc.render();
        } catch (error: any) {
            const errors = error?.properties?.errors;
            console.error("🛑 Erros no template do DOCX:");
            
            if (Array.isArray(errors)) {
                errors.forEach((err, index) => {
                    console.error(`Erro ${index + 1}:`, err.properties?.explanation);
                });
            } else {
                console.error("Erro genérico:", error);
            }
            throw new Error("Erro ao renderizar o documento: Multi error");
        }
    
        const buf = doc.getZip().generate({ type: 'nodebuffer' });
        fs.writeFileSync(tempDocxPath, buf);
    
        // 2. Converte DOCX para PDF usando LibreOffice (modo headless)
        await new Promise((resolve, reject) => {

            //exec(`"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf "${tempDocxPath}" --outdir "${path.dirname(tempDocxPath)}"`, (error, stdout, stderr) => {
            //EM TESTE LOCAL, FORA DE CONTAINER: SUBSTITUA A LINHA ABAIXO POR ESTA ACIMA: 
            exec(`soffice --headless --convert-to pdf "${tempDocxPath}" --outdir "${path.dirname(tempDocxPath)}"`, (error, stdout, stderr) => {
                if (error) {
                    return reject(`Erro na conversão: ${stderr}`);
                }
                resolve(stdout);
            });
        });
    
        // 3. Retorna o buffer do PDF
        const pdfBuffer = fs.readFileSync(tempPdfPath);
    
        // ⚠️ 4. Limpeza dos arquivos temporários
        fs.unlinkSync(tempDocxPath);
        fs.unlinkSync(tempPdfPath);
    
        return pdfBuffer;
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
        
        inscricoes.length = 5;
        if (!inscricoes) { // Se for null ou undefined
            return 0;
        }
        return inscricoes.length;
    }

}

