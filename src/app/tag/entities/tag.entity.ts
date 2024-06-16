import { IsNumber, IsString } from 'class-validator';
import { Tag as TagPrisma } from '@prisma/postgresql_client';
export class Tag implements TagPrisma {
  @IsNumber()
  tag_id: number;
  @IsString()
  tag_name: string;
  @IsString()
  tag_description: string;
  created_at: Date;
  updated_at: Date;
  blog_id: number;
}
