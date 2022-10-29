import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../typeorm/Post';
import { SubscribersModule } from '../subscribers/subscribers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), SubscribersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
