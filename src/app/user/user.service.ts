import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { GetUserInfoDto } from './dto/get-user.dto';
import { SSOService } from 'src/common/utils/api/sso/sso.service';

@Injectable()
export class UserService {
  constructor(private ssoService: SSOService) {}

  async getUserInfo(getUserInfoDto: GetUserInfoDto) {
    const { data, errors, status } = await this.ssoService.getUserInfo(
      getUserInfoDto
    );
    if (!errors) return data;

    if (status === HttpStatus.UNAUTHORIZED) {
      throw new UnauthorizedException(errors);
    }

    throw new InternalServerErrorException(errors);
  }
}
