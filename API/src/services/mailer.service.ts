import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';

@Injectable()
export class MailerService {
    constructor(private nestMailerService: NestMailerService) { }

    /**
     * Envia um e-mail simples com assunto e mensagem HTML.
     * @param email - E-mail de destino.
     * @param mensagem - Conteúdo HTML do e-mail.
     * @param subject - Assunto do e-mail.
     */
    async sendEmail(email: string, mensagem: string, subject: string) {
        await this.nestMailerService.sendMail({
            to: email,
            subject: subject,
            html: mensagem
        });
    }

    /**
     * Envia um e-mail de recuperação de senha para o usuário.
     * Lê o template HTML, substitui o token na URL e envia o e-mail.
     * @param email - E-mail do usuário.
     * @param token - Token de recuperação de senha.
     */
    async sendPasswordRecoveryEmail(email: string, token: string) {
        let htmlContent: any = fs.readFileSync('src/email-templates/RecuperacaoDeSenhaTemplate.html', 'utf8');
        const url: string = 'https://www.simtefac.com.br/?token=' + token + '#RecuperacaoDeSenha';
        htmlContent = htmlContent.replaceAll('<%URL_RECUPERACAO_DE_SENHA%>', url)
        this.sendEmail(email, htmlContent, "RECUPERAÇÃO DE SENHA");
    }
}