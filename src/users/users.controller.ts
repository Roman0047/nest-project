import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('auth/signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @UsePipes(ValidationPipe)
  update(@Body() dto: UpdateUserDto, @Request() req) {
    return this.usersService.updateUser(dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  getOne(
    @Param('id') id: string,
    @Request() req,
    @Query('sports') sports,
    @Query('tricks') tricks,
    @Query('completedTricks') completedTricks,
  ) {
    return this.usersService.getById(
      id,
      req.user,
      sports,
      tricks,
      completedTricks,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/add-sport/:id')
  addSport(@Param('id') id: string, @Request() req) {
    return this.usersService.addUserSport(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/add-trick/:id')
  addTrick(@Param('id') id: string, @Request() req) {
    return this.usersService.addUserTrick(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile/trick/:id')
  removeTrick(@Param('id') id: string, @Request() req) {
    return this.usersService.removeUserTrick(id, req.user);
  }
}
