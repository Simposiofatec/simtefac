import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';

@Injectable()
export class MailerService {
    constructor(private nestMailerService: NestMailerService) { }

    async sendEmail(email: string, mensagem: string, subject: string) {
        await this.nestMailerService.sendMail({
            to: email,
            subject: subject,
            html: mensagem
        });
    }

    async sendPasswordRecoveryEmail(email: string, token: string) {
        let htmlContent: any = fs.readFileSync('src/email-templates/RecuperacaoDeSenhaTemplate.html', 'utf8');
        const url: string = 'https://www.simtefac.com.br/?token=' + token + '#RecuperacaoDeSenha';
        htmlContent = htmlContent.replaceAll('<%URL_RECUPERACAO_DE_SENHA%>', url)
        this.sendEmail(email, htmlContent, "RECUPERAÇÃO DE SENHA");
    }
}
