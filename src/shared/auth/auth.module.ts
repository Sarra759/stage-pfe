import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { StoreModule } from '../store/store.module';
import { MailModule } from '../mail/mail.module';
import { AuthController } from './controllers/auth.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';
@Module({
  imports: [UserManagementModule, ConfigModule, StoreModule, MailModule, LoggerModule,],
  controllers: [AuthController],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
