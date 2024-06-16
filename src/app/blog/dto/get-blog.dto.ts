import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { PaginationList } from 'src/common/classes/pagination-list.class';
import { Blog } from '../entities/blog.entity';

export class GetBlogListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(Blog)
) {}
