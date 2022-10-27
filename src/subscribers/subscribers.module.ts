import { forwardRef, Module } from '@nestjs/common';
import { SubscribersController } from './subscribers.controller';
import { SubscribersService } from './subscribers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from '../typeorm/Subscriber';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber]),
    forwardRef(() => UsersModule),
  ],
  controllers: [SubscribersController],
  providers: [SubscribersService],
  exports: [SubscribersService],
})
export class SubscribersModule {}
