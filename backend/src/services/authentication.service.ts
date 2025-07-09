/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { SignUpDTO } from 'src/models/dtos/signUp.dto';
import { UserService } from './user.service';
import { UserEntity } from 'src/models/entities/user.entity';
import { eError } from 'src/models/errors';
import { JwtService } from "@nestjs/jwt";
import { SignInDTO } from 'src/models/dtos/signIn.dto';
import * as sha256 from 'crypto-js/sha256';
import { randomUUID } from 'crypto'
import { FindUserDTO } from 'src/models/dtos/findUser.dto';
import { UpdateUserDTO } from 'src/models/dtos/updateUser.dto';
import { RecoverPasswordDTO } from 'src/models/dtos/recoverPassword.dto';
import { MailerService } from './mailer.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordRecoveryEntity } from 'src/models/entities/password-recovery.entity';
import { Repository } from 'typeorm';
import { ResetPasswordDTO } from 'src/models/dtos/resetPassword.dto';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        @InjectRepository(PasswordRecoveryEntity) private passwordRecoveryRepository: Repository<PasswordRecoveryEntity>
    ) { }

    /**
     * Realiza o cadastro de um novo usuário.
     * Valida os parâmetros, converte o e-mail para minúsculo e a senha para hash SHA256.
     * Atualiza o usuário na base de dados.
     * @param signUpDTO - Dados para cadastro.
     * @returns Promise que resolve para o usuário cadastrado.
     */
    async signUpUser(signUpDTO: SignUpDTO): Promise<UserEntity> {
        if (!signUpDTO.email || !signUpDTO.password)
            throw eError.INVALID_PARAMETERS

        signUpDTO.email = signUpDTO.email.toLowerCase();

        try {
            signUpDTO.password = sha256(signUpDTO.password).toString();
        } catch (error) {
            throw (error);
        }

        const user: UserEntity = await this.userService.findOne({ email: signUpDTO.email } as FindUserDTO);

        if (!user)
            throw eError.USER_NOT_FOUND
        if (user.password)
            throw eError.USER_ALREADY_REGISTERED

        return this.userService.updateUser(signUpDTO as UpdateUserDTO);
    }

    /**
     * Realiza o login do usuário.
     * Valida os parâmetros, converte o e-mail para minúsculo e compara a senha (hash SHA256).
     * @param signInDTO - Dados de login.
     * @returns Promise que resolve para o usuário autenticado.
     */
    async signInUser(signInDTO: SignInDTO): Promise<UserEntity> {
        if (!signInDTO.email || !signInDTO.password)
            throw eError.INVALID_PARAMETERS

        signInDTO.email = signInDTO.email.toLowerCase();

        const user = await this.userService.findOne({ email: signInDTO.email } as FindUserDTO);

        if (!user || !user.password)
            throw eError.USER_NOT_FOUND

        const dbPassword = user.password;
        const signInPassword = sha256(signInDTO.password).toString();

        if (dbPassword !== signInPassword)
            throw eError.WRONG_PASSWORD

        return user;
    }

    /**
     * Gera um token JWT para o usuário informado.
     * @param email - E-mail do usuário.
     * @returns Promise que resolve para o token JWT.
     */
    public async generateToken(email: string): Promise<string> {
        email = email.toLowerCase();

        const user = await this.userService.findOne({ email } as FindUserDTO);

        if (!user)
            throw eError.USER_NOT_FOUND

        try {
            return this.jwtService.sign(
                {
                    email: user.email,
                    attributes: user.attributes ?? [].map(attribute => attribute.id)
                },
                {
                    secret: process.env.JWT_KEY,
                    expiresIn: process.env.JWT_EXPIRATION
                });
        }
        catch (e) {
            console.log(e);
        }
    }

    /**
     * Inicia o processo de recuperação de senha.
     * Gera um token de recuperação e envia por e-mail.
     * @param recoverPasswordDTO - Dados para recuperação de senha.
     * @returns Promise que resolve quando o e-mail é enviado.
     */
    async recoverPassword(recoverPasswordDTO: RecoverPasswordDTO): Promise<void> {
        recoverPasswordDTO.email = recoverPasswordDTO.email.toLowerCase();
        const user = await this.userService.findOne({ email: recoverPasswordDTO.email } as FindUserDTO);

        if (!user)
            throw eError.USER_NOT_FOUND;

        await this.passwordRecoveryRepository.delete({ userEmail: recoverPasswordDTO.email });

        const passwordRecovery: PasswordRecoveryEntity = { userEmail: recoverPasswordDTO.email, token: randomUUID() } as PasswordRecoveryEntity;
        await this.passwordRecoveryRepository.save(passwordRecovery);

        return this.mailerService.sendPasswordRecoveryEmail(user.email, passwordRecovery.token);
    }

    /**
     * Redefine a senha do usuário usando o token de recuperação.
     * Valida o token, atualiza a senha (hash SHA256) e remove o token utilizado.
     * @param resetPasswordDTO - Dados para redefinição de senha.
     * @returns Promise que resolve para o usuário atualizado.
     */
    async resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<UserEntity> {
        if (!resetPasswordDTO.password || resetPasswordDTO.password.length < 6 || !resetPasswordDTO.token)
            throw eError.NOT_ENOUGTH_PARAMETERS;

        resetPasswordDTO.password = sha256(resetPasswordDTO.password).toString();

        const passwordRecovery = await this.passwordRecoveryRepository.findOne({ where: { token: resetPasswordDTO.token } });
        if (!passwordRecovery)
            throw eError.INVALID_TOKEN;

        let user: UserEntity = await this.userService.findOne({ email: passwordRecovery.userEmail } as FindUserDTO);

        await this.userService.updateUser({ email: user.email, password: resetPasswordDTO.password } as UpdateUserDTO);

        await this.passwordRecoveryRepository.delete({ userEmail: user.email });

        return this.userService.findOne({ email: passwordRecovery.userEmail } as FindUserDTO);

    }
}