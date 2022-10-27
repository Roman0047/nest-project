import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeorm/User';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../enums/role.enum';
import { ThemeService } from '../theme/theme.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SubscribersService } from '../subscribers/subscribers.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private themeService: ThemeService,
    @Inject(forwardRef(() => SubscribersService))
    private subscribersService: SubscribersService,
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

  async getById(id: string, user?: User) {
    if (!parseInt(id)) throw new NotFoundException();

    const item = await this.userRepository.findOneBy({ id: parseInt(id) });
    if (item) {
      if (item.password) {
        delete item.password;
      }

      let isSubscribed = false;

      if (user) {
        isSubscribed = !!(await this.subscribersService.getActiveSubscription(
          id,
          user.id,
        ));
      }

      return {
        ...item,
        isSubscribed,
      };
    }

    throw new NotFoundException();
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

  async updateUser(dto: UpdateUserDto, currentUser) {
    const userWithSameEmail = await this.userRepository.findOneBy({
      email: dto.email,
    });
    if (userWithSameEmail && userWithSameEmail.email !== currentUser.email) {
      throw new BadRequestException('This email already exists');
    }

    const user = this.userRepository.findOneBy({ id: currentUser.id });

    const newUser = this.userRepository.create({
      ...user,
      ...dto,
    });
    if (!newUser.id) {
      newUser.id = parseInt(currentUser.id);
    }
    return await this.userRepository.save(newUser);
  }
}
