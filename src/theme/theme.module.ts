import { Module } from '@nestjs/common';
import { ThemeController } from './theme.controller';
import { ThemeService } from './theme.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theme } from '../typeorm/Theme';

@Module({
  imports: [TypeOrmModule.forFeature([Theme])],
  controllers: [ThemeController],
  providers: [ThemeService],
  exports: [ThemeService],
})
export class ThemeModule {}
