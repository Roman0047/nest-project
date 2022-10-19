import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTrickDto } from './dto/create-trick.dto';
import { UpdateTrickDto } from './dto/update-trick.dto';
import { Trick } from '../typeorm/Trick';

@Injectable()
export class TricksService {
  constructor(
    @InjectRepository(Trick)
    private readonly trickRepository: Repository<Trick>,
  ) {}

  getAll() {
    return this.trickRepository.find();
  }

  async getById(id: string) {
    if (!parseInt(id)) throw new NotFoundException();

    const item = await this.trickRepository.findOneBy({ id: parseInt(id) });
    if (item) return item;
    throw new NotFoundException();
  }

  create(dto: CreateTrickDto) {
    const newTrick = this.trickRepository.create(dto);
    return this.trickRepository.save(newTrick);
  }

  async update(id: string, dto: UpdateTrickDto) {
    if (!parseInt(id)) throw new NotFoundException();

    const trick = this.trickRepository.create(dto);
    if (!trick.id) {
      trick.id = parseInt(id);
    }
    return await this.trickRepository.save(trick);
  }

  async remove(id: string) {
    await this.trickRepository.delete(id);
  }
}
