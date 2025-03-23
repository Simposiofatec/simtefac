import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from 'src/controllers/event.controller';
import { AttributeEntity } from 'src/models/entities/attribute.entity';
import { EventEntity } from 'src/models/entities/event.entity';
import { EventService } from 'src/services/event.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity]),
    TypeOrmModule.forFeature([AttributeEntity])
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService]
})
export class EventModule { }
