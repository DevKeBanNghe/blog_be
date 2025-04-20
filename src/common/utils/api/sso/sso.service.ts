import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/consts';
import { HttpServiceUtilService } from '../../httpService/http-service-util.service';
import { SubscribeUserDto } from './dto/subscribe-user.dto';
@Injectable()
export class SSOService {
  private url: string;

  constructor(
    private configService: ConfigService,
    private httpServiceUtilService: HttpServiceUtilService
  ) {
    this.url = this.configService.get(EnvVars.SSO_BE_URL);
  }

  async getUserInfo() {
    const data = await this.httpServiceUtilService.axios.get(
      `${this.url}/users/info`
    );
    return data;
  }

  async refreshToken() {
    const data = await this.httpServiceUtilService.axios.get(
      `${this.url}/auth/refresh-token`
    );
    return data;
  }

  async getCookieKeys() {
    const data = await this.httpServiceUtilService.axios.get(
      `${this.url}/auth/cookie-keys`
    );
    return data;
  }

  async subscribeUser(payload: SubscribeUserDto) {
    const data = await this.httpServiceUtilService.axios.post(
      `${this.url}/users/subscribe`,
      payload
    );
    return data;
  }
}
