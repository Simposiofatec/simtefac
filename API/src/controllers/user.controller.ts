import { Body, Controller, Get, HttpStatus, Param, Post, Res, Query, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CreateUserDTO } from 'src/models/dtos/createUser.dto';
import { eError } from 'src/models/errors';
import { UserService } from 'src/services/user.service';
import { FailureResponse, SuccessResponse } from 'src/models/response';
import { Response } from 'express';
import { FindUserDTO } from 'src/models/dtos/findUser.dto';
import { AuthorizedAttributes } from 'src/decorators/userAttributes.decorator';
import { Reflector } from '@nestjs/core';
import * as QRCode from 'qrcode';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserEntity } from 'src/models/entities/user.entity';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService, private reflector: Reflector) { }

    @Post("")
    async createUser(@Body() createUserDTO: CreateUserDTO, @Res() res: Response) {
        try {
            await this.userService.createUser(createUserDTO);
            const response: SuccessResponse = {
                message: 'Usuário criado com sucesso.'
            }

            res.status(HttpStatus.CREATED)
                .send(response);
        }
        catch (error) {
            switch (error) {
                case eError.USER_ALREADY_EXISTS: {
                    const response: FailureResponse = {
                        message: "E-Mail já cadastrado."
                    }

                    res.status(HttpStatus.CONFLICT)
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

    @Post("xlsx")
    @UseInterceptors(FileInterceptor('file'))
    async createUserFromXLSX(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        try {
            await this.userService.createUsersFromXLSX(file.buffer);
            const response: SuccessResponse = {
                message: 'Usuários criados com sucesso.'
            }

            res.status(HttpStatus.CREATED)
                .send(response);
        }
        catch (error) {
            switch (error) {
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

    @Get("find")
    async find(@Query() findUserDTO: FindUserDTO, @Res() res: Response) {
        const response: SuccessResponse = {
            content: (await this.userService.findMany(findUserDTO)).map((userEntity: UserEntity) => userEntity.toViewModel())
        }

        res.status(HttpStatus.OK)
            .send(response);
    }

    @Get("me")
    @AuthorizedAttributes('*')
    async getSelfUser(@Req() req: Request, @Res() res: Response) {
        const user = (await this.userService.findOne({ email: req['user'].email } as FindUserDTO)).toViewModel();

        const response: SuccessResponse = {
            content: user
        }

        res.status(HttpStatus.OK)
            .send(response);
    }

    @Get("me/qrcode")
    @AuthorizedAttributes('*')
    async getQrCode(@Req() req: Request, @Res() res: Response) {
        const user = (await this.userService.findOne({ email: req['user'].email } as FindUserDTO)).toViewModel();

        const strQRCode = await this.generateQRCodePNG(user.email);

        const response: SuccessResponse = {
            content: strQRCode
        }

        res.status(HttpStatus.OK)
            .send(response);
    }

    generateQRCodePNG(text: string): Promise<string> {
        return new Promise((resolve, reject) => {
            QRCode.toDataURL(text, { scale: 20 }, (err, url) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(url);
                }
            });
        });
    }
}
