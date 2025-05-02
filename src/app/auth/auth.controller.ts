import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { cookieConfigsDefault } from 'src/consts/cookie.const';
import { ApiService } from 'src/common/utils/api/api.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private apiServie: ApiService
  ) {}

  @Get('/refresh-token')
  async refreshToken(
    @Query('user_id') user_id: string,
    @Res() res: Response,
    @Req() req: Request
  ) {
    const data = await this.authService.refreshToken({ user_id });
    const cookieKeys = await this.authService.getCookieKeys();
    const { access_token_key, refresh_token_key } = cookieKeys;
    const { access_token, refresh_token } = data ?? {};
    if (access_token)
      res.cookie(access_token_key, access_token, cookieConfigsDefault);
    if (refresh_token)
      res.cookie(refresh_token_key, refresh_token, cookieConfigsDefault);
    res.status(200).json(
      this.apiServie.formatResponse({
        path: req.path,
        data,
      })
    );
    return data;
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    const cookieKeys = await this.authService.getCookieKeys();
    res.clearCookie(cookieKeys.access_token_key, cookieConfigsDefault);
    res.clearCookie(cookieKeys.refresh_token_key, cookieConfigsDefault);
    res.status(200).json({});
    return {};
  }
}
