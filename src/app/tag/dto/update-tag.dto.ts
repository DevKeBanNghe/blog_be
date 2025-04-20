import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';
import { Blog, Tag } from '@prisma-postgresql/models';

class UpdateTagDto extends IntersectionType(
  PickType(Tag, ['tag_id']),
  PartialType(CreateTagDto)
) {}

class UpdateBlogDto extends PickType(Blog, ['blog_id']) {
  tag_ids: string[];
}

class UpdateActivateStatusDto extends IntersectionType(
  PickType(Tag, ['is_active'])
) {
  tag_ids: Tag['tag_id'][];
}

export { UpdateTagDto, UpdateBlogDto, UpdateActivateStatusDto };
