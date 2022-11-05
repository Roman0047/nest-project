import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeorm/User';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostsService } from '../posts/posts.service';
import { Comment } from '../typeorm/Comment';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private postsService: PostsService,
  ) {}

  async create(id, user: User, dto: CreateCommentDto) {
    const comment = this.commentRepository.create(dto);
    comment.user = user;
    comment.post = await this.postsService.getNativeById(id);
    return await this.commentRepository.save(comment);
  }

  async update(id, dto: UpdateCommentDto) {
    if (!parseInt(id)) throw new NotFoundException();

    const comment = this.commentRepository.create(dto);
    if (!comment.id) {
      comment.id = parseInt(id);
    }
    return await this.commentRepository.save(comment);
  }

  async remove(id: string) {
    await this.commentRepository.delete(id);
  }
}
