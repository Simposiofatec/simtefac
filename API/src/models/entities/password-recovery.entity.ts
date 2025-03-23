import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('PasswordRecovery')
export class PasswordRecoveryEntity {
    @PrimaryColumn({ nullable: false })
    token: string;

    @Column({ nullable: false })
    userEmail: string;

    @OneToOne(() => UserEntity, (user) => user.subscriptions)
    user: UserEntity;
}
