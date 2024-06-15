import { Controller, Get, Res, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Cookies } from 'src/common/decorators/cookies.decorator';
import { Request, Response } from 'express';
import {
  COOKIE_SSO_ACCESS_TOKEN_KEY,
  COOKIE_SSO_REFRESH_TOKEN_KEY,
} from 'src/consts/cookie.const';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/info')
  async getUserInfo(
    @Cookies(COOKIE_SSO_ACCESS_TOKEN_KEY) access_token: string
  ) {
    return this.userService.getUserInfo({ token: access_token });
  }
}
