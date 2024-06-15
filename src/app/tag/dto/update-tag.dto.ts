import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Tag } from '../entities/tag.entity';
import { CreateTagDto } from './create-tag.dto';
import { Blog } from 'src/app/blog/entities/blog.entity';

export class UpdateTagDto extends IntersectionType(
  PickType(Tag, ['tag_id']),
  PartialType(CreateTagDto)
) {}

export class UpdateBlogDto extends PickType(Blog, ['blog_id']) {
  tag_ids: number[];
}
