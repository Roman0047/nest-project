import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAll(
    @Query('sport') sport,
    @Query('trick') trick,
    @Query('user') user,
    @Query('userId') userId,
  ) {
    return this.postsService.getAll({
      sport,
      trick,
      user,
      userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('subscriptions')
  getSubscriptionsPosts(@Request() req) {
    return this.postsService.getSubscriptionsPost(req.user.id);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.postsService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() dto: CreatePostDto, @Request() req) {
    return this.postsService.create(dto, req.user);
  }
}
