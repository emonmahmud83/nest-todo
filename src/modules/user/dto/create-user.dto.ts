import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'emon', description: 'name of user' })
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty({ example: 'emon@gmail.com', description: 'email of user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({ example: 'password', description: 'password of user' })
  @IsNotEmpty()
  @IsString()
  password: string;
  // @ApiProperty({ example: ['todo id'], description: 'todo of user' })
  // @IsOptional()
  // @IsArray()
  // todos: string[];
}
