import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/User';
import { ThemeModule } from '../theme/theme.module';
import { Subscriber } from '../typeorm/Subscriber';
import { SubscribersModule } from '../subscribers/subscribers.module';
import { Sport } from '../typeorm/Sport';
import { Trick } from '../typeorm/Trick';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Subscriber, Sport, Trick]),
    ThemeModule,
    forwardRef(() => SubscribersModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
