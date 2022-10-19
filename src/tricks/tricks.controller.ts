import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { TricksService } from './tricks.service';
import { CreateTrickDto } from './dto/create-trick.dto';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '../enums/role.enum';
import { UpdateTrickDto } from './dto/update-trick.dto';

@Controller('tricks')
export class TricksController {
  constructor(private readonly tricksService: TricksService) {}

  @Get()
  getAll() {
    return this.tricksService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.tricksService.getById(id);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() dto: CreateTrickDto) {
    return this.tricksService.create(dto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() dto: UpdateTrickDto) {
    return this.tricksService.update(id, dto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tricksService.remove(id);
  }
}
