import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { AttributeEntity } from './attribute.entity';
import { SubscriptionEntity } from './subscriptions.entity';
import { EventViewModel } from '../viewModels/event.view-model';

@Entity('Event')
export class EventEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: true })
    place: string;

    @Column({ nullable: false, length: 'MAX' })
    description: string;

    @Column({ nullable: false })
    start: Date;

    @Column({ nullable: false })
    end: Date;

    @Column({ nullable: false })
    color: string;

    @Column({ nullable: false })
    maximumCapacity: number;

    @Column({ nullable: false })
    mandatoryEntry: boolean;

    @Column({ nullable: false })
    mandatoryExit: boolean;

    @ManyToMany(() => AttributeEntity, {
        cascade: true
    })
    @JoinTable({ name: 'event_auto_subscribe_attributes' })
    autoSubscribeAttributes: AttributeEntity[];

    @ManyToMany(() => AttributeEntity, {
        cascade: true
    })
    @JoinTable({ name: 'event_authorized_attributes' })
    authorizedAttributes: AttributeEntity[];

    @OneToMany(() => SubscriptionEntity, (subscription) => subscription.event)
    subscriptions: SubscriptionEntity[];

    toViewModel(): EventViewModel {
        return {
            id: this.id,
            title: this.title,
            start: this.start,
            end: this.end,
            place: this.place,
            description: this.description,
            maximumCapacity: this.maximumCapacity,
            color: this.color,
            mandatoryEntry: this.mandatoryEntry,
            mandatoryExit: this.mandatoryExit,
            subscriptionCount: this.subscriptions.length
        } as EventViewModel;
    }
}
