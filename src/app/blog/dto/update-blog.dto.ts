import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Blog } from '../entities/blog.entity';
import { CreateBlogDto } from './create-blog.dto';

export class UpdateBlogDto extends IntersectionType(
  PickType(Blog, ['blog_id']),
  PartialType(CreateBlogDto)
) {}
