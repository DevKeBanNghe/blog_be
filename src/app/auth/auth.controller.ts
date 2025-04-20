import { Controller, Get, Res, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SaveTokenInterceptor } from './interceptors/save-token.interceptor';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/refresh-token')
  @UseInterceptors(SaveTokenInterceptor)
  async refreshToken() {
    return await this.authService.refreshToken();
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    const cookieKeys = await this.authService.getCookieKeys();
    res.clearCookie(cookieKeys.access_token_key);
    res.clearCookie(cookieKeys.refresh_token_key);
    res.status(200).json({});
    return {};
  }
}
