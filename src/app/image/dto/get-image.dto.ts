import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Image } from '@prisma-postgresql/models';
import { PaginationList } from 'src/common/classes/pagination-list.class';

class GetImageListByPaginationDto extends IntersectionType(
  PaginationList,
  PartialType(Image)
) {}

class ExportImagesDto {
  ids: Image['image_id'][];
}

export { GetImageListByPaginationDto, ExportImagesDto };
