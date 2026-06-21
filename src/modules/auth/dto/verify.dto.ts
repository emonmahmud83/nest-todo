import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyDto {
  @ApiProperty({ example: 'emon@gmail.com', description: 'email of user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({ example: '123456', description: 'otp of user' })
  @IsNotEmpty()
  @IsString()
  otp: string;
}
