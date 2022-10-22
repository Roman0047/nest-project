import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theme } from '../typeorm/Theme';
import { User } from '../typeorm/User';
import { UpdateThemeDto } from './dto/update-theme.dto';

@Injectable()
export class ThemeService {
  constructor(
    @InjectRepository(Theme)
    private readonly themeRepository: Repository<Theme>,
  ) {}

  create(user: User) {
    const theme = this.themeRepository.create();
    theme.user = user;
    return this.themeRepository.save(theme);
  }

  async update(id: string, dto: UpdateThemeDto) {
    if (!parseInt(id)) throw new NotFoundException();

    const theme = this.themeRepository.create(dto);
    if (!theme.id) {
      theme.id = parseInt(id);
    }
    return await this.themeRepository.save(theme);
  }
}
