import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
// import { Roles } from './decorators/roles.decorator';
// import { Role } from './enums/role.enum';
// import { RolesGuard } from './guards/roles.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @Roles(Role.Admin) // todo add Admin guard for sports creation
  // @UseGuards(JwtAuthGuard, RolesGuard)
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
