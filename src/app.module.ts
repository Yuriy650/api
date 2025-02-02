import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import { FeedModule } from './feed/feed.module';
import { AuthModule } from './auth/auth.module';
import {LoggerMiddleware} from "./middlewares/loger.middleware";
import {AuthController} from "./auth/controllers/auth.controller";

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true}),
      TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.POSTGRES_HOST,
          port: parseInt(<string>process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          database: process.env.POSTGRES_DATABASE,
          password: process.env.POSTGRES_PASSWORD,
          autoLoadEntities: true,
          synchronize: true
      }),
      FeedModule,
      AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes(AuthController)
    }
}
