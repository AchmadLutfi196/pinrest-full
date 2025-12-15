import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ example: 'Travel Photos', description: 'Board title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'My favorite travel destinations', description: 'Board description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/cover.jpg', description: 'Cover image URL', required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ example: false, description: 'Is board private', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
