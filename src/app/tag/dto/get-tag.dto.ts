import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { PaginationList } from 'src/common/classes/pagination-list.class';
import { OptionParams } from 'src/common/classes/option.class';
import { Tag } from '@prisma-postgresql/models';

class GetTagListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(Tag)
) {}

class GetTagOptionsDto extends IntersectionType(
  OptionParams,
  PartialType(Tag)
) {}

class ExportTagsDto {
  ids: Tag['tag_id'][];
}

export { GetTagListByPaginationDto, GetTagOptionsDto, ExportTagsDto };
