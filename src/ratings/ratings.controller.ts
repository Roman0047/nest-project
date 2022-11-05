import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  @UsePipes(ValidationPipe)
  create(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: CreateRatingDto,
  ) {
    return this.ratingsService.create(id, req.user, dto);
  }
}
