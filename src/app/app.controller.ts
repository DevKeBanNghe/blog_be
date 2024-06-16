import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/consts';
@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}
  @Get()
  welcome() {
    return `Welcome to ${this.configService.get(EnvVars.APP_NAME)} service !`;
  }
}
