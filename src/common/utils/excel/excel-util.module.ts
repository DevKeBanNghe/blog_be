import { Module } from '@nestjs/common';
import { ExcelUtilService } from './excel-util.service';
import { StringUtilModule } from '../string/string-util.module';
import { HttpServiceUtilModule } from '../httpService/http-service-util.module';

@Module({
  imports: [StringUtilModule, HttpServiceUtilModule],
  providers: [ExcelUtilService],
  exports: [ExcelUtilService],
})
export class ExcelUtilModule {}
