import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SportsService } from './sports.service';
import { CreateSportDto } from './dto/create-sport.dto';

@Controller('sports')
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Get()
  getAll() {
    return this.sportsService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.sportsService.getById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createSportDto: CreateSportDto) {
    return this.sportsService.create(createSportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sportsService.remove(id);
  }
}
