import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';
import { AttributeEntity } from './attribute.entity';
import { UserViewModel } from '../viewModels/user.view-model';
import { SubscriptionEntity } from './subscriptions.entity';

@Entity('User')
export class UserEntity {
    @PrimaryColumn({ nullable: false })
    email: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    password: string | undefined;

    @ManyToMany(() => AttributeEntity, {
        cascade: true
    })
    @JoinTable({ name: 'user_attributes' })
    attributes: AttributeEntity[];

    @OneToMany(() => SubscriptionEntity, (subscription) => subscription.event)
    subscriptions: SubscriptionEntity[];

    toViewModel(): UserViewModel {
        return {
            email: this.email,
            name: this.name,
            attributes: this.attributes.map(attribute => attribute.id)
        } as UserViewModel;
    }
}
