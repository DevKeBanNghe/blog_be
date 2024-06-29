import { IsString } from 'class-validator';
import { Tag as TagPrisma } from '@prisma/postgresql_client';
export class Tag implements TagPrisma {
  @IsString()
  tag_id: string;
  @IsString()
  tag_name: string;
  @IsString()
  tag_description: string;
  created_at: Date;
  updated_at: Date;
}
