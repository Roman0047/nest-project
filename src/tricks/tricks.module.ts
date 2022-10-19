import { Module } from '@nestjs/common';
import { TricksController } from './tricks.controller';
import { TricksService } from './tricks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trick } from '../typeorm/Trick';

@Module({
  imports: [TypeOrmModule.forFeature([Trick])],
  controllers: [TricksController],
  providers: [TricksService],
})
export class TricksModule {}
