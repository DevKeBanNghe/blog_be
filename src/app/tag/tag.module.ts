import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { ExcelUtilModule } from 'src/common/utils/excel/excel-util.module';

@Module({
  imports: [ExcelUtilModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
