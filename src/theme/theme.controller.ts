import {
  Body,
  Controller,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { ThemeService } from './theme.service';

@Controller('theme')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Patch(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() dto: UpdateThemeDto) {
    return this.themeService.update(id, dto);
  }
}
