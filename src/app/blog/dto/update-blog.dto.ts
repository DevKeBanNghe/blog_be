import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Blog } from '../entities/blog.entity';
import { CreateBlogDto } from './create-blog.dto';
export class UpdateBlogDto extends IntersectionType(
  PickType(Blog, ['blog_id']),
  PartialType(CreateBlogDto)
) {}
export class UpdateBlogTrackingInfoDto extends PickType(UpdateBlogDto, [
  'blog_id',
  'blog_view',
]) {}

export class UpdatePublishBlogStatusDto extends PickType(Blog, [
  'blog_id',
  'blog_is_publish',
]) {}
