import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { Image } from '@prisma-postgresql/models';

class UpdateActivateStatusDto extends IntersectionType(
  PickType(Image, ['is_active'])
) {
  image_ids: Image['image_id'][];
}

export { UpdateActivateStatusDto };
