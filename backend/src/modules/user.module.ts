import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from 'src/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/entities/user.entity';
import { JwtAuthGuard } from 'src/helpers/jwt-authguard';
import { JwtService } from '@nestjs/jwt';
import { AttributeEntity } from 'src/models/entities/attribute.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([AttributeEntity])
  ],
  providers: [UserService, JwtAuthGuard, JwtService],
  controllers: [UserController],
  exports: [UserService, JwtService]
})
export class UserModule { }
