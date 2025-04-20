import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/mapped-types';
import { Blog } from '@prisma-postgresql/models';
import { ImportExcel } from 'src/common/classes/base.class';
import { SubscribeUserDto } from 'src/common/utils/api/sso/dto/subscribe-user.dto';

class CreateBlogDto extends IntersectionType(
  PickType(Blog, ['blog_title', 'blog_content']),
  PartialType(OmitType(Blog, ['tags']))
) {
  tag_ids: string[];
}

class SubscribeToBlogsDto extends SubscribeUserDto {}

class ImportBlogsDto extends ImportExcel {}

export { CreateBlogDto, SubscribeToBlogsDto, ImportBlogsDto };
