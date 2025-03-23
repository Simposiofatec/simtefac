import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('Parameter')
export class ParameterEntity {
    @PrimaryColumn({ nullable: false })
    version: string;

    @Column({ nullable: true, comment: 'Define a data inicial das inscrições' })
    subscriptionsStart: Date;
   
    @Column({ nullable: true, comment: 'Define a data final das inscrições' })
    subscriptionsEnd: Date;
    
    @Column({ nullable: true, comment: 'Define a data inicial do simósio' })
    eventsStart: Date;
   
    @Column({ nullable: true, comment: 'Define a data final do simpósio' })
    eventsEnd: Date;
}
