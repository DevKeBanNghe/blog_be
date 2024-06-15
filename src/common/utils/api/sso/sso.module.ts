import { Global, Module } from '@nestjs/common';
import { SSOService } from './sso.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [SSOService, ConfigService],
  exports: [SSOService],
})
export class SSOModule {}
