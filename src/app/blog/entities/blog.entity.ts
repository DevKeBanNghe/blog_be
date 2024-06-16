import { IsNumber, IsString } from 'class-validator';
import { Blog as BlogPrisma } from '@prisma/postgresql_client';

export class Blog implements BlogPrisma {
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
  created_at: Date;
  updated_at: Date;
}
