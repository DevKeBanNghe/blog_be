import { Global, Module } from '@nestjs/common';
import { FileUtilService } from './file-util.service';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  providers: [FileUtilService, JwtService],
  exports: [FileUtilService],
})
export class FileUtilModule {}
