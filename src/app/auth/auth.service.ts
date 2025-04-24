import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SSOService } from 'src/common/utils/api/sso/sso.service';

@Injectable()
export class AuthService {
  constructor(private ssoService: SSOService) {}

  async refreshToken(params = {}) {
    const {
      data: { data, errors },
    } = await this.ssoService.refreshToken(params);
    if (errors) throw new InternalServerErrorException(errors);
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
