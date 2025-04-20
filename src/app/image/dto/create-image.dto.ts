import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Image } from '@prisma-postgresql/models';

class CreateImageDto extends IntersectionType(
  PickType(Image, ['image_url']),
  PartialType(Image)
) {}

export { CreateImageDto };
