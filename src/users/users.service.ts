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
import { Sport } from '../typeorm/Sport';
import { Trick } from '../typeorm/Trick';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Sport)
    private readonly sportRepository: Repository<Sport>,
    @InjectRepository(Trick)
    private readonly trickRepository: Repository<Trick>,
    private themeService: ThemeService,
    @Inject(forwardRef(() => SubscribersService))
    private subscribersService: SubscribersService,
  ) {}

  async findByEmail(email: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('email = :email', { email })
      .getOne();
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: {
        theme: true,
        ratings: true,
        sports: true,
        tricks: true,
      },
    });
  }

  async getById(
    id: string,
    user?: User,
    sports?: boolean,
    tricks?: boolean,
    completedTricks?: boolean,
  ) {
    if (!parseInt(id)) throw new NotFoundException();

    const item = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      },
      relations: {
        sports: !!sports
          ? {
              tricks: !!tricks,
            }
          : false,
        tricks: !!completedTricks,
      },
    });
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
    newUser.sports = createUserDto.sports;
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

  async addUserSport(id: string, currentUser) {
    const sport = await this.sportRepository.findOneBy({ id: parseInt(id) });
    const user = await this.userRepository.findOne({
      where: { id: currentUser.id },
      relations: { sports: true },
    });
    user.sports.push(sport);
    return await this.userRepository.save(user);
  }

  async addUserTrick(id: string, currentUser) {
    const trick = await this.trickRepository.findOneBy({ id: parseInt(id) });
    const user = await this.userRepository.findOne({
      where: { id: currentUser.id },
      relations: { tricks: true },
    });
    user.tricks.push(trick);
    return await this.userRepository.save(user);
  }

  async removeUserTrick(id: string, currentUser) {
    const user = await this.userRepository.findOne({
      where: { id: currentUser.id },
      relations: { tricks: true },
    });
    user.tricks = user.tricks.filter((item) => item.id !== parseInt(id));
    return await this.userRepository.save(user);
  }
}
