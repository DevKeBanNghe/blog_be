import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TagService } from '../tag/tag.service';

@Module({
  controllers: [BlogController],
  providers: [BlogService, TagService],
  exports: [BlogService],
})
export class BlogModule {}
