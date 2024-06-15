import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { PaginationList } from 'src/common/classes/pagination-list.class';
import { Tag } from '../entities/tag.entity';
import { OptionParams } from 'src/common/classes/option.class';

export class GetTagListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(Tag)
) {}

export class GetTagOptionsDto extends IntersectionType(
  OptionParams,
  PartialType(Tag)
) {}
