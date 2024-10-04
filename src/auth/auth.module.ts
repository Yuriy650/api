import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./models/user.entity";
import {JwtModule} from "@nestjs/jwt";
import {JwtGuard} from "./guards/jwt.guard";
import {JwtStrategy} from "./guards/jwt.strategy";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {RolesGuard} from "./guards/roles.guard";

@Module({
  imports: [
      JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
              secret: configService.get('JWT_SECRET'),
              signOptions: {expiresIn: '3600s'}
          })
      }),
      TypeOrmModule.forFeature([UserEntity])
  ],
  providers: [AuthService, JwtGuard, JwtStrategy, RolesGuard],
  controllers: [AuthController]
})
export class AuthModule {}
