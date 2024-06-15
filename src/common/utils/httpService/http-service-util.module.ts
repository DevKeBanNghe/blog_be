import { Global, Module } from '@nestjs/common';
import { HttpServiceUtilService } from './http-service-util.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [HttpServiceUtilService],
  exports: [HttpServiceUtilService],
})
export class HttpServiceUtilModule {}
