import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SSOService } from 'src/common/utils/api/sso/sso.service';

@Injectable()
export class AuthService {
  constructor(private ssoService: SSOService) {}

  async refreshToken(params = {}) {
    const { data: { data, errors } = {}, status } =
      await this.ssoService.refreshToken(params);
    console.log('🚀 ~ AuthService ~ refreshToken ~ data:', data, params);
    const ExceptionClass =
      status === HttpStatus.UNAUTHORIZED
        ? UnauthorizedException
        : InternalServerErrorException;
    if (errors) throw new ExceptionClass(errors);
    return data;
  }

  async getCookieKeys() {
    const {
      data: { data, errors },
    } = await this.ssoService.getCookieKeys();
    if (errors) throw new InternalServerErrorException(errors);
    return data;
  }
}
