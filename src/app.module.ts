import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SportsModule } from './sports/sports.module';
import entities from './typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { TricksModule } from './tricks/tricks.module';
import { ThemeModule } from './theme/theme.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nest_app',
      synchronize: true,
      entities,
    }),
    MulterModule.register({ dest: './uploads' }),
    AuthModule,
    UsersModule,
    SportsModule,
    TricksModule,
    ThemeModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
