import { Module } from '@nestjs/common';
import { SSOService } from './sso.service';
import { ConfigService } from '@nestjs/config';
import { HttpServiceUtilModule } from '../../httpService/http-service-util.module';

@Module({
  imports: [HttpServiceUtilModule],
  providers: [SSOService, ConfigService],
  exports: [SSOService],
})
export class SSOModule {}
