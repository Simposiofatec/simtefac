import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthorizedAttributes } from 'src/decorators/userAttributes.decorator';
import { CreateEventDTO } from 'src/models/dtos/createEvent.dto';
import { FindUserDTO } from 'src/models/dtos/findUser.dto';
import { SubscriptionEntity } from 'src/models/entities/subscriptions.entity';
import { FailureResponse, SuccessResponse } from 'src/models/response';
import { EventService } from 'src/services/event.service';

@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @Post('')
    @AuthorizedAttributes(['ADM'])
    async createEvent(@Body() createEventDTO: CreateEventDTO, @Res() res: Response) {
        try {
            await this.eventService.createEvent(createEventDTO);
            const response: SuccessResponse = {
                message: 'Evento criado com sucesso.'
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

    @Post("xlsx")
    @UseInterceptors(FileInterceptor('file'))
    async createUserFromXLSX(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        try {
            await this.eventService.createEventsFromXLSX(file.buffer);
            const response: SuccessResponse = {
                message: 'Eventos criados com sucesso.'
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

    @Get('')
    async getAll(@Res() res: Response) {
        try {
            const response: SuccessResponse = {
                content: (await this.eventService.getAll()).map(event => event.toViewModel())
            }

            res.status(HttpStatus.OK)
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

    @Get(':eventId')
    async get(@Param() params: any, @Res() res: Response) {
        try {
            const response: SuccessResponse = {
                content: (await this.eventService.getById(params.eventId)).toViewModel()
            }

            res.status(HttpStatus.OK)
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

    @Get(':eventId/subscriptions')
    @AuthorizedAttributes(['ADM'])
    async GetEventSubscriptions(@Param() params: any, @Query() findUserDTO: FindUserDTO, @Res() res: Response) {
        try {
            const response: SuccessResponse = {
                content: (await this.eventService.getSubscriptions(params.eventId, findUserDTO.email))?.map((subscription: SubscriptionEntity) => subscription.toViewModel()) ?? []
            }

            res.status(HttpStatus.OK)
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
}
