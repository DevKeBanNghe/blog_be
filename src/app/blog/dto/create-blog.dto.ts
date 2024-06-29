import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Blog } from '../entities/blog.entity';

export class CreateBlogDto extends IntersectionType(
  PickType(Blog, ['blog_title', 'blog_content']),
  PartialType(Blog)
) {
  tag_ids: string[];
}
