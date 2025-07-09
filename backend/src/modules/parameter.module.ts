import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParameterController } from 'src/controllers/parameter.controller';
import { ParameterEntity } from 'src/models/entities/parameter.entity';
import { ParameterService } from 'src/services/parameter.service';
@Module({
  imports: [TypeOrmModule.forFeature([ParameterEntity])],
  controllers: [ParameterController],
  providers: [ParameterService],
  exports: [ParameterService]
})
export class ParameterModule { }
