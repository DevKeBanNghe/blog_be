import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'src/common/interfaces/http.interface';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/info')
  async getUserInfo(@Req() req: Request) {
    return req.user;
  }
}
