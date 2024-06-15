import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Tag } from '../entities/tag.entity';
import { Blog } from 'src/app/blog/entities/blog.entity';

export class CreateTagDto extends IntersectionType(
  PickType(Tag, ['tag_name']),
  PartialType(Tag),
  PickType(PartialType(Blog), ['blog_id'])
) {}
