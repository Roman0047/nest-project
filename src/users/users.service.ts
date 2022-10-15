import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeorm/User';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user.password) {
      delete user.password;
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const password = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (user) {
      throw new BadRequestException('This email already exists');
    }
    const newUser = this.userRepository.create({ ...createUserDto, password });
    return await this.userRepository.save(newUser);
  }
}
