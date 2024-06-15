import { Global, Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ConfigService } from '@nestjs/config';
import { SSOModule } from './sso/sso.module';

@Global()
@Module({
  imports: [SSOModule],
  providers: [ApiService, ConfigService],
  exports: [ApiService],
})
export class ApiModule {}
