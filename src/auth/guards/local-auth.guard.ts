import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const object = plainToInstance(LoginDto, request.body);

    const errors = await validate(object);

    if (errors.length > 0) {
      throw new UnprocessableEntityException(errors);
    }

    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw (
        err || new UnauthorizedException("You've entered wrong credentials")
      );
    }
    return user;
  }
}
