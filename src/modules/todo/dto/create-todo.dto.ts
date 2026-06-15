import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ example: 'title', description: 'title of todo' })
  @IsNotEmpty()
  @IsString()
  title: string;
  @ApiProperty({ example: 'description', description: 'description of todo' })
  @IsOptional()
  @IsString()
  description: string;
}
