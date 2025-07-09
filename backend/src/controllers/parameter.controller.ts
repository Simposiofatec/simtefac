/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpStatus, Patch, Post, Res, SetMetadata, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { FailureResponse, SuccessResponse } from 'src/models/response';
import { ParameterService } from 'src/services/parameter.service';
import { SetParameterDTO } from 'src/models/dtos/setParameter.dto';

@Controller('parameters')
export class ParameterController {
    constructor(private readonly parameterService: ParameterService) { }

    @Get('')
    async getAll(@Res() res: Response) {
        try {
            const response: SuccessResponse = {
                content: await this.parameterService.getAll()
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
    
 @Post('')
  async create(@Body() parametros: SetParameterDTO, @Res() res: Response) {
    try {
      await this.parameterService.create(parametros); // método para salvar os parâmetros
      const response: SuccessResponse = {
        message: 'Parâmetros salvos com sucesso.',
      };

      res.status(HttpStatus.CREATED).send(response);
    } catch (error) {
      const response: FailureResponse = {
        message: 'Ocorreu um erro desconhecido.',
      };

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response);
    }
  }
    @Patch('')
    async setParameter(@Body() setParameterDTO: SetParameterDTO, @Res() res: Response) {
        try {
            await this.parameterService.setParameter(setParameterDTO);
            const response: SuccessResponse = {
                message: 'Parâmetro definido com sucesso.'
            }

            res.status(HttpStatus.ACCEPTED)
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
