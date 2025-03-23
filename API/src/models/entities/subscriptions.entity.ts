import { Collection, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { EventEntity } from "./event.entity";
import { SubscriptionViewModel } from "../viewModels/subscription.view-model";

@Entity('Subscription')
export class SubscriptionEntity {
    @PrimaryColumn()
    userEmail: string;

    @PrimaryColumn()
    eventId: string;

    @Column({ nullable: false })
    subscriptionDate: Date;

    @Column({ nullable: true })
    entry: Date;

    @Column({ nullable: true })
    exit: Date;

    @ManyToOne(() => EventEntity, (event) => event.subscriptions)
    event: EventEntity;

    @ManyToOne(() => UserEntity, (user) => user.subscriptions)
    user: UserEntity;

    toViewModel(): SubscriptionViewModel {
        return {
            event: this.event?.toViewModel(),
            user: this.user?.toViewModel(),
            entry: this.entry,
            exit: this.exit
        } as SubscriptionViewModel;
    }
}
