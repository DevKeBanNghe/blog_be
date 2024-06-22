import { IsNumber, IsString } from 'class-validator';
import { Blog as BlogPrisma } from '@prisma/postgresql_client';
import { BaseEntity } from 'src/common/entities/base.entity';

export class Blog extends BaseEntity implements BlogPrisma {
  @IsNumber()
  blog_id: number;
  @IsString()
  blog_title: string;
  @IsString()
  blog_content: string;
  @IsString()
  blog_description: string;
  @IsString()
  blog_thumbnail: string;
  @IsNumber()
  blog_view: number;
  blog_reading_time: number;
}
