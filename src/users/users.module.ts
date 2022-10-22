import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/User';
import { ThemeModule } from '../theme/theme.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ThemeModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
