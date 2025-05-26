/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { CreateRecordDTO } from 'src/models/dtos/createRecord.dto';
import { CreateSubscriptionDTO } from 'src/models/dtos/createSubscription.dto';
import { DeleteSubscriptionDTO } from 'src/models/dtos/deleteSubscription.dto';
import { EventEntity } from 'src/models/entities/event.entity';
import { SubscriptionEntity } from 'src/models/entities/subscriptions.entity';
import { eError } from 'src/models/errors';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(SubscriptionEntity) private subscriptionRepository: Repository<SubscriptionEntity>,
        @InjectRepository(EventEntity) private eventRepository: Repository<EventEntity>
    ) { }

    /**
     * Busca todas as inscrições de um usuário pelo e-mail.
     * Inclui as relações com usuário e evento.
     * @param userEmail - E-mail do usuário.
     * @returns Promise que resolve para um array de inscrições.
     */
    async find(userEmail: string): Promise<SubscriptionEntity[]> {
        const subscriptions = this.subscriptionRepository.find({
            where: {
                userEmail: userEmail
            },
            relations: [
                'user',
                'event'
            ]
        });

        return subscriptions;
    }

    /**
     * Cria uma nova inscrição para um usuário em um evento.
     * Valida se o evento existe, se o usuário já está inscrito e se há vagas.
     * @param createSubscriptionDTO - Dados para criar a inscrição.
     * @returns Promise que resolve para a inscrição criada.
     */
    async createSubscription(createSubscriptionDTO: CreateSubscriptionDTO) {
        const event = await this.eventRepository.findOne({
            where: {
                id: createSubscriptionDTO.eventId
            },
            relations: [
                'subscriptions'
            ]
        });

        if (!event)
            throw eError.EVENT_NOT_FOUND

        let subscription: SubscriptionEntity = await this.subscriptionRepository.findOne({
            where: {
                userEmail: createSubscriptionDTO.userEmail,
                eventId: createSubscriptionDTO.eventId
            }
        });

        if (subscription)
            throw eError.USER_ALREADY_SUBSCRIBED

        if (event.subscriptions.length >= event.maximumCapacity)
            throw eError.EVENT_IS_FULL

        subscription = { ...createSubscriptionDTO, subscriptionDate: new Date() } as SubscriptionEntity;

        return this.subscriptionRepository.save(subscription);
    }

    /**
     * Remove a inscrição de um usuário em um evento.
     * @param deleteSubscriptionDTO - Dados para identificar a inscrição a ser removida.
     * @returns Promise que resolve quando a inscrição é removida.
     */
    async deleteSubscription(deleteSubscriptionDTO: DeleteSubscriptionDTO) {
        if (!await this.subscriptionRepository.findOne({
            where: {
                userEmail: deleteSubscriptionDTO.userEmail,
                eventId: deleteSubscriptionDTO.eventId
            }
        })) {
            throw eError.SUBSCRIPTION_NOT_FOUND
        }

        return this.subscriptionRepository.delete({
            userEmail: deleteSubscriptionDTO.userEmail,
            eventId: deleteSubscriptionDTO.eventId
        });
    }

    /**
     * Registra a entrada ou saída do usuário em um evento, conforme a obrigatoriedade.
     * Se a entrada já foi registrada, registra a saída.
     * @param createRecordDTO - Dados para registrar presença.
     * @returns Promise que resolve para a inscrição atualizada.
     */
    async createRecord(createRecordDTO: CreateRecordDTO): Promise<SubscriptionEntity | undefined> {
        const subscription = await this.subscriptionRepository.findOne({
            relations: [
                'event',
                'user'
            ],
            where: {
                userEmail: createRecordDTO.userEmail,
                eventId: createRecordDTO.eventId
            }
        });

        if (!subscription)
            throw eError.SUBSCRIPTION_NOT_FOUND;

        if (subscription.event.mandatoryEntry && !subscription.entry)
            subscription.entry = new Date();
        else if (subscription.event.mandatoryExit && !subscription.exit)
            subscription.exit = new Date();
        else
            throw eError.RECORD_ALREADY_CREATED

        return this.subscriptionRepository.save(subscription);
    }
}