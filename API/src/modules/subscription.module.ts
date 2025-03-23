import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from 'src/controllers/subscription.controller';
import { EventEntity } from 'src/models/entities/event.entity';
import { SubscriptionEntity } from 'src/models/entities/subscriptions.entity';
import { SubscriptionService } from 'src/services/subscription.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),
    TypeOrmModule.forFeature([EventEntity])
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService]
})
export class SubscriptionModule { }
