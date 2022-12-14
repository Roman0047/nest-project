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
    @Query('sportId') sportId,
    @Query('trickId') trickId,
    @Query('postId') postId,
    @Query('search') search,
    @Query('sportsIds') sportsIds,
    @Query('tricksIds') tricksIds,
    @Query('limit') limit,
  ) {
    return this.postsService.getAll({
      sport,
      trick,
      user,
      userId,
      sportId,
      trickId,
      postId,
      search,
      sportsIds,
      tricksIds,
      limit,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('subscriptions')
  getSubscriptionsPosts(
    @Request() req,
    @Query('sportsIds') sportsIds,
    @Query('tricksIds') tricksIds,
    @Query('search') search,
  ) {
    return this.postsService.getSubscriptionsPosts(
      req.user.id,
      sportsIds,
      tricksIds,
      search,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string, @Request() req) {
    return this.postsService.getById(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() dto: CreatePostDto, @Request() req) {
    return this.postsService.create(dto, req.user);
  }
}
