import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeorm/User';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../enums/role.enum';
import { ThemeService } from '../theme/theme.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private themeService: ThemeService,
  ) {}

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        theme: true,
      },
    });
    if (user.password) {
      delete user.password;
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const password = await bcrypt.hash(createUserDto.password, 10);
    const userWithSameEmail = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (userWithSameEmail) {
      throw new BadRequestException('This email already exists');
    }
    const newUser = this.userRepository.create({
      ...createUserDto,
      role: Role.User,
      password,
    });
    const user = await this.userRepository.save(newUser);
    await this.themeService.create(user);
    return await this.findById(user.id);
  }
}
