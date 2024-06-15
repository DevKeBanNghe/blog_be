import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SaveTokenInterceptor } from './interceptors/save-token.interceptor';
import { COOKIE_SSO_REFRESH_TOKEN_KEY } from 'src/consts/cookie.const';
import { Cookies } from 'src/common/decorators/cookies.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/refresh-token')
  @UseInterceptors(SaveTokenInterceptor)
  async refreshToken(
    @Cookies(COOKIE_SSO_REFRESH_TOKEN_KEY) refresh_token: string
  ) {
    return await this.authService.refreshToken({ token: refresh_token });
  }
}
