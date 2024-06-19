import { IntersectionType, PartialType, PickType } from '@nestjs/mapped-types';
import { Image } from '../entities/image.entity';

export class CreateImageDto extends IntersectionType(
  PickType(Image, ['image_url']),
  PartialType(Image)
) {}
