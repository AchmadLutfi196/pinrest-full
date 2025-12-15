import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class SavePinDto {
  @ApiProperty({ example: 1, description: 'Board ID to save pin to' })
  @IsInt()
  boardId: number;
}
