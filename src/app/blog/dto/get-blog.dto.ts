import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Blog } from '@prisma-postgresql/models';
import { PaginationList } from 'src/common/classes/pagination-list.class';

class GetBlogListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(Blog)
) {}

type GetBlogDetail = {
  [key in keyof Partial<Blog>]: boolean;
};

class ExportBlogsDto {
  ids: Blog['blog_id'][];
}

export { GetBlogListByPaginationDto, GetBlogDetail, ExportBlogsDto };
