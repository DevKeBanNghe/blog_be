import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SSOService } from 'src/common/utils/api/sso/sso.service';

@Injectable()
export class UserService {
  constructor(private ssoService: SSOService) {}

  async getUserInfo() {
    const {
      data: { data, errors },
      status,
    } = await this.ssoService.getUserInfo();
    if (!errors) return data;

    const exceptions = {
      [HttpStatus.UNAUTHORIZED]: UnauthorizedException,
      [HttpStatus.FORBIDDEN]: ForbiddenException,
    };

    const Exception = exceptions[status] ?? InternalServerErrorException;
    throw new Exception(errors);
  }
}
