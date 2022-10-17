import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Sport } from '../typeorm/Sport';
import { CreateSportDto } from './dto/create-sport.dto';

@Injectable()
export class SportsService {
  constructor(
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
  ) {}

  getAll() {
    return this.sportRepository.find();
  }

  async getById(id: string) {
    if (!parseInt(id)) throw new NotFoundException();

    const item = await this.sportRepository.findOneBy({ id: parseInt(id) });
    if (item) return item;
    throw new NotFoundException();
  }

  create(dto: CreateSportDto) {
    const newSport = this.sportRepository.create(dto);
    return this.sportRepository.save(newSport);
  }

  async remove(id: string) {
    await this.sportRepository.delete(id);
  }
}
