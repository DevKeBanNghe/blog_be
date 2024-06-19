import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { PaginationList } from 'src/common/classes/pagination-list.class';
import { Image } from '../entities/image.entity';

export class GetImageListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(Image)
) {}
