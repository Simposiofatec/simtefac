/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificateController } from '../controllers/certificate.controller';
import { CertificateService } from '../services/certificate.service';
import { EventEntity } from 'src/models/entities/event.entity';
import { AttributeEntity } from 'src/models/entities/attribute.entity';
import { ParameterEntity } from 'src/models/entities/parameter.entity';
import { SubscriptionEntity } from 'src/models/entities/subscriptions.entity';
import { UserEntity } from 'src/models/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventEntity, 
      AttributeEntity,
      SubscriptionEntity,
      ParameterEntity,
      UserEntity
    ]),
  ],
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService]
})
export class CertificateModule {}