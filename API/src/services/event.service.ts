/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { CreateEventDTO } from 'src/models/dtos/createEvent.dto';
import { AttributeEntity } from 'src/models/entities/attribute.entity';
import { EventEntity } from 'src/models/entities/event.entity';
import { Any, FindOptionsWhere, In, Repository } from 'typeorm';
import * as Excel from 'exceljs';
import { SubscriptionEntity } from 'src/models/entities/subscriptions.entity';
import { FindUserDTO } from 'src/models/dtos/findUser.dto';

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(EventEntity) private eventRepository: Repository<EventEntity>,
        @InjectRepository(AttributeEntity) private attributeRepository: Repository<AttributeEntity>
    ) { }

    /**
     * Cria um novo evento com os atributos autorizados e de inscrição automática.
     * @param createEventDTO - Dados para criação do evento.
     * @returns Promise que resolve para o evento criado.
     */
    async createEvent(createEventDTO: CreateEventDTO) {
        const authorizedAttributes: AttributeEntity[] = (createEventDTO.authorizedAttributes == '*' || !createEventDTO.authorizedAttributes)
            ? await this.attributeRepository.find()
            : await this.attributeRepository.findBy({ id: In(createEventDTO.authorizedAttributes as string[]) });
        const autoSubscribeAttributes: AttributeEntity[] = (createEventDTO.autoSubscribeAttributes == '*' || !createEventDTO.autoSubscribeAttributes)
            ? await this.attributeRepository.find()
            : await this.attributeRepository.findBy({ id: In(createEventDTO.autoSubscribeAttributes as string[]) });
        const event = { ...createEventDTO, authorizedAttributes, autoSubscribeAttributes } as EventEntity;
        return this.eventRepository.save(event);
    }

    /**
     * Busca todos os eventos cadastrados, incluindo atributos e inscrições relacionadas.
     * @returns Promise que resolve para um array de eventos.
     */
    async getAll(): Promise<EventEntity[]> {
        const events = this.eventRepository.find({
            relations: [
                'authorizedAttributes',
                'autoSubscribeAttributes',
                'subscriptions'
            ]
        });

        return events;
    }

    /**
     * Busca um evento pelo ID, incluindo atributos e inscrições relacionadas.
     * @param id - ID do evento.
     * @returns Promise que resolve para o evento encontrado.
     */
    async getById(id: string): Promise<EventEntity> {
        const event = this.eventRepository.findOne({
            where: { id: id },
            relations: [
                'authorizedAttributes',
                'autoSubscribeAttributes',
                'subscriptions'
            ]
        });

        return event;
    }

    /**
     * Busca as inscrições de um evento, podendo filtrar por e-mail do usuário.
     * @param eventId - ID do evento.
     * @param userEmail - E-mail do usuário (opcional).
     * @returns Promise que resolve para um array de inscrições.
     */
    async getSubscriptions(eventId: string, userEmail?: string): Promise<SubscriptionEntity[]> {
        let findWhereOptions: FindOptionsWhere<EventEntity> = { id: eventId }

        if (userEmail)
            findWhereOptions = { ...findWhereOptions, subscriptions: [{ userEmail: userEmail }] }

        const event = await this.eventRepository.findOne({
            where: findWhereOptions,
            relations:
                [
                    'subscriptions',
                    'subscriptions.user',
                    'subscriptions.user.attributes',
                    'subscriptions.event',
                    'subscriptions.event.subscriptions'
                ]
        });

        return event?.subscriptions;
    }

    /**
     * Cria múltiplos eventos a partir de um arquivo XLSX.
     * Cada linha da planilha representa um evento.
     * @param xlsxBuffer - Buffer do arquivo XLSX.
     */
    async createEventsFromXLSX(xlsxBuffer: Excel.Buffer) {
        const workbook = new Excel.Workbook();
        await workbook.xlsx.load(xlsxBuffer);

        const worksheet = workbook.getWorksheet(1);
        worksheet.getRow(1).destroy();

        worksheet.eachRow((row: Excel.Row, rowNumber: number) => {
            const title = row.getCell(1).value;
            const description = row.getCell(2).value.toString();
            const place = row.getCell(3).value;
            const start = new Date(row.getCell(4).value.toString());
            const end = new Date(row.getCell(5).value.toString());
            const mandatoryEntry: boolean = row.getCell(6).value.toString() == '1';
            const mandatoryExit: boolean = row.getCell(7).value.toString() == '1';
            const maximumCapacity = row.getCell(8).value;
            const color = row.getCell(9).value;

            const createEventDTO: CreateEventDTO = {
                authorizedAttributes: '*',
                autoSubscribeAttributes: [],
                title,
                description,
                place,
                start,
                end,
                mandatoryEntry,
                mandatoryExit,
                maximumCapacity,
                color
            } as CreateEventDTO;

            this.createEvent(createEventDTO);
        });
    }
}