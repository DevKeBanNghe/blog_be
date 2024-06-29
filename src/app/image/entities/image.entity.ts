import { IsString } from 'class-validator';
import { Image as ImagePrisma } from '@prisma/postgresql_client';
export class Image implements ImagePrisma {
  @IsString()
  image_id: string;
  @IsString()
  image_url: string;
  @IsString()
  image_name: string;
  @IsString()
  image_description: string;
  created_at: Date;
  updated_at: Date;
}
