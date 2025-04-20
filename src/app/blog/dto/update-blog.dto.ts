import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';
import { Blog } from '@prisma-postgresql/models';
class UpdateBlogDto extends IntersectionType(
  PickType(Blog, ['blog_id']),
  PartialType(CreateBlogDto)
) {}

class UpdateBlogTrackingInfoDto extends PickType(UpdateBlogDto, [
  'blog_id',
  'blog_view',
]) {}

class UpdatePublishBlogStatusDto extends PickType(Blog, [
  'blog_id',
  'blog_is_publish',
]) {}

class UpdateActivateStatusDto extends IntersectionType(
  PickType(Blog, ['is_active'])
) {
  blog_ids: Blog['blog_id'][];
}

export {
  UpdateBlogDto,
  UpdateBlogTrackingInfoDto,
  UpdatePublishBlogStatusDto,
  UpdateActivateStatusDto,
};
