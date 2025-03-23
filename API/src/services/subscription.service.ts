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
    constructor(@InjectRepository(SubscriptionEntity) private subscriptionRepository: Repository<SubscriptionEntity>, @InjectRepository(EventEntity) private eventRepository: Repository<EventEntity>) { }

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
