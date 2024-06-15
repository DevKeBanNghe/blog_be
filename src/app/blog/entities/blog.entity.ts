import { IsNumber, IsString } from 'class-validator';
export class Blog {
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
}
