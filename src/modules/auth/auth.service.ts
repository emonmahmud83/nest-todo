import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const existUser = await this.prisma.client.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existUser) {
      throw new BadRequestException('user already exist');
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.client.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashPassword,
      },
    });

    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      message: 'user created successfully',
      data: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto) {
    const existUser = await this.prisma.client.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!existUser) {
      throw new UnauthorizedException('user not found');
    }

    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      existUser.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('password is not correct');
    }

    const token = await this.jwtService.signAsync({
      id: existUser.id,
      email: existUser.email,
    });

    return {
      success: true,
      message: 'user logged in successfully',
      data: token,
    };
  }
}
