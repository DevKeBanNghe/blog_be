import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { SSOModule } from 'src/common/utils/api/sso/sso.module';
import { TagModule } from '../tag/tag.module';
import { ExcelUtilModule } from 'src/common/utils/excel/excel-util.module';

@Module({
  imports: [SSOModule, TagModule, ExcelUtilModule],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
