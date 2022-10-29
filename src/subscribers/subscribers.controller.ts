import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('subscriptions')
  getSubscriptions(@Request() req) {
    return this.subscribersService.getSubscriptionsUsers(req.user.id);
  }

  @Get(':id')
  getSubscribersLength(@Param('id') id: string) {
    return this.subscribersService.getSubscribersLength(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  @UsePipes(ValidationPipe)
  create(@Param('id') id: string, @Request() req) {
    return this.subscribersService.create(id, req.user);
  }
}
