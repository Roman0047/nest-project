import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from '../typeorm/Post';
import { User } from '../typeorm/User';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  getAll() {
    return this.postRepository.find();
  }

  async getById(id: string) {
    if (!parseInt(id)) throw new NotFoundException();

    const item = await this.postRepository.findOneBy({ id: parseInt(id) });
    if (item) return item;
    throw new NotFoundException();
  }

  create(dto: CreatePostDto, user: User) {
    const post = this.postRepository.create(dto);
    post.user = user;
    post.sport = dto.sport;
    post.trick = dto.trick;
    return this.postRepository.save(post);
  }
}
