import { IsNumber, IsString } from 'class-validator';
export class Tag {
  @IsNumber()
  tag_id: number;
  @IsString()
  tag_name: string;
  @IsString()
  tag_description: string;
}
