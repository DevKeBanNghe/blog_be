import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/swagger';
import { Blog, Tag } from '@prisma-postgresql/models';
import { ImportExcel } from 'src/common/classes/base.class';

class CreateTagDto extends IntersectionType(
  PickType(Tag, ['tag_name']),
  PartialType(OmitType(Tag, ['blogs'])),
  PickType(PartialType(Blog), ['blog_id'])
) {}

class ImportTagsDto extends ImportExcel {}

export { CreateTagDto, ImportTagsDto };
