import { Module } from '@nestjs/common';
import { FeedController } from './controllers/feed.controller';
import { FeedService } from './services/feed.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FeedPostEntity} from "./models/post.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([FeedPostEntity]),
      AuthModule
  ],
  controllers: [FeedController],
  providers: [FeedService]
})
export class FeedModule {}
