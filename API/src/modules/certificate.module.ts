import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificateController } from '../controllers/certificate.controller';
import { CertificateService } from '../services/certificate.service';
import { ParameterEntity } from 'src/models/entities/parameter.entity';
import { SubscriptionEntity } from 'src/models/entities/subscriptions.entity';
import { UserEntity } from 'src/models/entities/user.entity';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionEntity,
      ParameterEntity,
      UserEntity,
    ]),
    UserModule,
  ],
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule {}
