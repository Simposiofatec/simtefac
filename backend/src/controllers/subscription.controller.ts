import { Body, Controller, Delete, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthorizedAttributes } from 'src/decorators/userAttributes.decorator';
import { CreateRecordDTO } from 'src/models/dtos/createRecord.dto';
import { CreateSubscriptionDTO } from 'src/models/dtos/createSubscription.dto';
import { DeleteSubscriptionDTO } from 'src/models/dtos/deleteSubscription.dto';
import { eError } from 'src/models/errors';
import { FailureResponse, SuccessResponse } from 'src/models/response';
import { SubscriptionService } from 'src/services/subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @Get('me')
    @AuthorizedAttributes('*')
    async getFromSelfUser(@Req() req: Request, @Res() res: Response) {
        const userEmail = req['user'].email;
        const response: SuccessResponse = {
            content: (await this.subscriptionService.find(userEmail)) ?? []
        }

        res.status(HttpStatus.OK)
            .send(response);
    }

    @Post('me')
    @AuthorizedAttributes('*')
    async subscribeSelfUser(@Req() req: Request, @Res() res: Response, @Body() createSubscriptionDTO: CreateSubscriptionDTO) {
        try {
            createSubscriptionDTO.userEmail = req['user'].email;
            await this.subscriptionService.createSubscription(createSubscriptionDTO);
            const response: SuccessResponse = {
                message: 'Inscrição realizada com sucesso.'
            }

            res.status(HttpStatus.CREATED)
                .send(response);
        }
        catch (error) {
            switch (error) {
                case eError.USER_ALREADY_SUBSCRIBED: {
                    const response: FailureResponse = {
                        message: "Inscrição já realizada."
                    }

                    res.status(HttpStatus.CONFLICT)
                        .send(response);
                    break;
                }
                case eError.EVENT_NOT_FOUND: {
                    const response: FailureResponse = {
                        message: "Evento não encontrado."
                    }

                    res.status(HttpStatus.NOT_FOUND)
                        .send(response);
                    break;
                }
                case eError.EVENT_IS_FULL: {
                    const response: FailureResponse = {
                        message: "Evento lotado."
                    }

                    res.status(HttpStatus.FORBIDDEN)
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

    @Delete('me')
    @AuthorizedAttributes('*')
    async unsubscribeSelfUser(@Req() req: Request, @Res() res: Response, @Body() deleteSubscriptionDTO: DeleteSubscriptionDTO) {
        try {
            deleteSubscriptionDTO.userEmail = req['user'].email;
            await this.subscriptionService.deleteSubscription(deleteSubscriptionDTO);
            const response: SuccessResponse = {
                message: 'Inscrição removida com sucesso.'
            }

            res.status(HttpStatus.CREATED)
                .send(response);
        }
        catch (error) {
            switch (error) {
                case eError.SUBSCRIPTION_NOT_FOUND: {
                    const response: FailureResponse = {
                        message: "Inscrição não encontrada."
                    }

                    res.status(HttpStatus.NOT_FOUND)
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

    @Post('record')
    @AuthorizedAttributes('ADM')
    async createRecord(@Body() createRecordDTO: CreateRecordDTO, @Res() res: Response) {
        try {
            const response: SuccessResponse = {
                message: 'Registro realizado com sucesso.',
                content: await this.subscriptionService.createRecord(createRecordDTO)
            }

            res.status(HttpStatus.CREATED)
                .send(response);
        }
        catch (error) {
            switch (error) {
                case eError.SUBSCRIPTION_NOT_FOUND: {
                    const response: FailureResponse = {
                        message: "Inscrição não encontrada."
                    }

                    res.status(HttpStatus.NOT_FOUND)
                        .send(response);
                    break;
                }
                case eError.RECORD_ALREADY_CREATED: {
                    const response: FailureResponse = {
                        message: "Presença já confirmada anteriormente."
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
}
