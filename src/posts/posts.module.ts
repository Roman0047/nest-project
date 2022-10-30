import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../typeorm/Post';
import { SubscribersModule } from '../subscribers/subscribers.module';
import { Sport } from '../typeorm/Sport';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Sport]), SubscribersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
