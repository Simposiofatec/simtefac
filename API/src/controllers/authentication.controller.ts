import { Body, Controller, HttpStatus, Post, Res, SetMetadata, UseGuards } from '@nestjs/common';
import { SignUpDTO } from 'src/models/dtos/signUp.dto';
import { Response } from 'express';
import { AuthenticationService } from 'src/services/authentication.service';
import { eError } from 'src/models/errors';
import { FailureResponse, SuccessResponse } from 'src/models/response';
import { UserEntity } from 'src/models/entities/user.entity';
import { SignInDTO } from 'src/models/dtos/signIn.dto';
import { RecoverPasswordDTO } from 'src/models/dtos/recoverPassword.dto';
import { ResetPasswordDTO } from 'src/models/dtos/resetPassword.dto';
import { UserService } from 'src/services/user.service';
import { AuthorizedAttributes } from 'src/decorators/userAttributes.decorator';

@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService, private readonly userService: UserService) { }

    @Post('signup')
    async signUp(@Body() signUpDTO: SignUpDTO, @Res() res: Response) {
        try {
            const user: UserEntity = await this.authenticationService.signUpUser(signUpDTO);

            const response: SuccessResponse = {
                message: 'Usuário cadastrado com sucesso.'
            }

            res.status(HttpStatus.CREATED)
                .send(response);
        }
        catch (error) {
            switch (error) {
                case eError.USER_NOT_FOUND: {
                    const response: FailureResponse = {
                        message: "E-mail não encontrado. Verifique se você está utilizando o e-mail INSTITUCIONAL."
                    }

                    res.status(HttpStatus.NOT_FOUND)
                        .send(response);
                    break;
                }
                case eError.USER_ALREADY_REGISTERED: {
                    const response: FailureResponse = {
                        message: "Usuário já cadastrado."
                    }

                    res.status(HttpStatus.CONFLICT)
                        .send(response);
                    break;
                }
                case eError.INVALID_PARAMETERS: {
                    const response: FailureResponse = {
                        message: "Todos os campos devem ser preenchidos."
                    }

                    res.status(HttpStatus.BAD_REQUEST)
                        .send(response);
                    break;
                }
                default: {
                    const response: FailureResponse = {
                        message: "Ocorreu um erro desconhecido."
                    }

                    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send(response);
                    break;
                }
            }
        }
    }

    @Post('signin')
    async signIn(@Body() signInDTO: SignInDTO, @Res() res: Response) {
        try {
            await this.authenticationService.signInUser(signInDTO);

            const newToken = await this.authenticationService.generateToken(signInDTO.email);
            res.set({ 'Authorization': 'Bearer ' + newToken });

            res.status(HttpStatus.OK);
            res.send();
        }
        catch (error) {
            switch (error) {
                case eError.USER_NOT_FOUND: {
                    const response: FailureResponse = {
                        message: "E-mail não encontrado. Verifique se já realizou o CADASTRO utilizando o e-mail INSTITUCIONAL.",
                        internalCode: error
                    }

                    res.status(HttpStatus.NOT_FOUND)
                        .send(response);
                    break;
                }
                case eError.WRONG_PASSWORD: {
                    const response: FailureResponse = {
                        message: "Senha incorreta.",
                        internalCode: error
                    }

                    res.status(HttpStatus.FORBIDDEN)
                        .send(response);
                    break;
                }
                case eError.INVALID_PARAMETERS: {
                    const response: FailureResponse = {
                        message: "Todos os campos devem ser preenchidos.",
                        internalCode: error
                    }

                    res.status(HttpStatus.BAD_REQUEST)
                        .send(response);
                    break;
                }
                default: {
                    const response: FailureResponse = {
                        message: "Ocorreu um erro desconhecido."
                    }

                    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send(response);
                    break;
                }
            }
        }
    }

    @Post('recoverpassword')
    async recoverPassword(@Body() recoverPasswordDTO: RecoverPasswordDTO, @Res() res: Response) {
        try {
            await this.authenticationService.recoverPassword(recoverPasswordDTO);

            res.status(HttpStatus.OK);
            res.send();
        }
        catch (error) {
            switch (error) {
                case eError.USER_NOT_FOUND: {
                    const response: FailureResponse = {
                        message: "E-mail não encontrado. Verifique se já realizou o CADASTRO utilizando o e-mail INSTITUCIONAL.",
                        internalCode: error
                    }

                    res.status(HttpStatus.NOT_FOUND)
                        .send(response);
                    break;
                }
                case eError.NOT_ENOUGTH_PARAMETERS: {
                    const response: FailureResponse = {
                        message: "Todos os campos devem ser preenchidos.",
                        internalCode: error
                    }

                    res.status(HttpStatus.BAD_REQUEST)
                        .send(response);
                    break;
                }
                default: {
                    const response: FailureResponse = {
                        message: "Ocorreu um erro desconhecido."
                    }

                    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send(response);
                    break;
                }
            }
        }
    }

    @Post('resetpassword')
    async resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO, @Res() res: Response) {
        try {
           const user = await this.authenticationService.resetPassword(resetPasswordDTO);

            const response: SuccessResponse = {
                content: user.toViewModel()
            }
            res.status(HttpStatus.OK)
                .send(response);
        }
        catch (error) {
            switch (error) {
                case eError.INVALID_TOKEN: {
                    const response: FailureResponse = {
                        message: "Link de recuperação de senha expirado ou inválido.",
                        internalCode: error
                    }

                    res.status(HttpStatus.NOT_FOUND)
                        .send(response);
                    break;
                }
                case eError.NOT_ENOUGTH_PARAMETERS: {
                    const response: FailureResponse = {
                        message: "Todos os campos devem ser preenchidos.",
                        internalCode: error
                    }

                    res.status(HttpStatus.BAD_REQUEST)
                        .send(response);
                    break;
                }
                default: {
                    const response: FailureResponse = {
                        message: "Ocorreu um erro desconhecido."
                    }

                    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send(response);
                    break;
                }
            }
        }
    }
}
