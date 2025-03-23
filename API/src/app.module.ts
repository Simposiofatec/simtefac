import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user.module';
import { AuthenticationModule } from './modules/authentication.module';
import { TokenRefresherMiddleware } from './middlewares/tokenRefresher.middleware';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './helpers/jwt-authguard';
import { ParameterModule } from './modules/parameter.module';
import { EventModule } from './modules/event.module';
import { SubscriptionModule } from './modules/subscription.module';
import { MailerService } from './services/mailer.service';
import { MailerModule } from '@nestjs-modules/mailer';

require('dotenv').config();
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    MailerService
  ],
  imports: [
    UserModule,
    AuthenticationModule,
    ParameterModule,
    EventModule,
    SubscriptionModule,
    TypeOrmModule.forRoot({

      type: 'mssql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 1433),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
      dropSchema: false,
      extra: {
        trustServerCertificate: true
      }
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_SMTP_HOST,
        secure: true, 
        port: Number(process.env.EMAIL_SMTP_PORT), 
        auth: { 
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        requireTLS: true
      },
      defaults: { // configurações que podem ser padrões
        from: process.env.EMAIL_SMTP_DEFAULT_FROM,
      },
    })
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenRefresherMiddleware)
      .exclude("/authentication/(.*)")
      .forRoutes("/");
  }
}
