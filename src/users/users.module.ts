import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/User';
import { ThemeModule } from '../theme/theme.module';
import { Subscriber } from '../typeorm/Subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([User, Subscriber]), ThemeModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
