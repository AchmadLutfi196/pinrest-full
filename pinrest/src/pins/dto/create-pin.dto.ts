import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreatePinDto {
  @ApiProperty({ example: 'Beautiful Sunset', description: 'Pin title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'A beautiful sunset over the ocean', description: 'Pin description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/sunset.jpg', description: 'Image URL' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ example: 'https://source-website.com', description: 'Source link', required: false })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({ example: 1, description: 'Board ID to add pin to', required: false })
  @IsOptional()
  @IsInt()
  boardId?: number;
}
