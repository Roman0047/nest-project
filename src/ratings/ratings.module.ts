import { forwardRef, Module } from '@nestjs/common';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from '../posts/posts.module';
import { Rating } from '../typeorm/Rating';

@Module({
  imports: [TypeOrmModule.forFeature([Rating]), forwardRef(() => PostsModule)],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingsModule {}
