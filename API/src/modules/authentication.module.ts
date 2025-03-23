import { Module } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import { UserModule } from './user.module';
import { AuthenticationController } from 'src/controllers/authentication.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenRefresherMiddleware } from 'src/middlewares/tokenRefresher.middleware';
import { JwtAuthGuard } from 'src/helpers/jwt-authguard';
import { APP_GUARD } from '@nestjs/core';
import { MailerService } from 'src/services/mailer.service';
import { PasswordRecoveryEntity } from 'src/models/entities/password-recovery.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([PasswordRecoveryEntity])
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtService,
    MailerService,
  ],
  exports: [AuthenticationService]
})
export class AuthenticationModule { }
