import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/consts';
import { GetUserInfoDto } from './dto/get-sso.dto';
import { HttpServiceUtilService } from '../../httpService/http-service-util.service';
import { RefreshTokenDto } from './dto/token.dto';

@Injectable()
export class SSOService {
  private url: string;
  constructor(
    private configService: ConfigService,
    private readonly httpServiceUtilService: HttpServiceUtilService
  ) {
    this.url = this.configService.get(EnvVars.SSO_BE_URL);
  }

  async getUserInfo({ token = '' }: GetUserInfoDto) {
    return await this.httpServiceUtilService.get(`${this.url}/users/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async refreshToken({ token = '' }: RefreshTokenDto) {
    return await this.httpServiceUtilService.get(
      `${this.url}/auth/refresh-token`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
