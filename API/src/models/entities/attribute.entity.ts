import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('Attribute')
export class AttributeEntity {
    @PrimaryColumn({ nullable: false })
    id: string;

    @Column({ nullable: true })
    description: string;

    @ManyToMany(() => UserEntity, {
        cascade: true
    })
    @JoinTable({ name: 'user_attributes' })
    users: UserEntity[];
}
