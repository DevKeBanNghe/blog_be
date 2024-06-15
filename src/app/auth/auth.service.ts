import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RefreshTokenDto } from './dto/get-auth.dto';
import { SSOService } from 'src/common/utils/api/sso/sso.service';

@Injectable()
export class AuthService {
  constructor(private ssoService: SSOService) {}

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { data, errors } = await this.ssoService.refreshToken(
      refreshTokenDto
    );

    if (errors) throw new InternalServerErrorException(errors);

    return data;
  }
}
