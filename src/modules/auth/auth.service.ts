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
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyDto } from './dto/verify.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const existUser = await this.prisma.client.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existUser) {
      throw new BadRequestException('user already exist');
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    const otp = Math.floor(10000 + Math.random() * 9000).toString();
    const expireIn = new Date();
    expireIn.setMinutes(expireIn.getMinutes() + 10);
    const user = await this.prisma.client.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashPassword,
        otp: otp,
        otpExpireAt: expireIn,
      },
    });

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify your email - NestJS Todo App',
      html: `
        <h1>Hello ${user.name}, Verify Your Email</h1>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    });
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      message: 'user created successfully',
      data: userWithoutPassword,
    };
  }

  async verify(verifyOtp: VerifyDto) {
    const user = await this.prisma.client.user.findUnique({
      where: { email: verifyOtp.email },
    });
    if (!user) throw new BadRequestException('User not found');
    if (user.isVerified)
      return { success: true, message: 'User is already verified' };
    if (user.otp !== verifyOtp.otp) {
      throw new BadRequestException('Invalid OTP');
    }
    if (new Date() > (user?.otpExpireAt || new Date())) {
      throw new BadRequestException('OTP has expired');
    }
    await this.prisma.client.user.update({
      where: { id: user.id },
      data: { isVerified: true, otp: null, otpExpireAt: null },
    });
    return {
      success: true,
      message: 'user verified successfully',
    };
  }

  async login(loginDto: LoginDto) {
    const existUser = await this.prisma.client.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!existUser) {
      throw new UnauthorizedException('user not found');
    }
    
    if (!existUser.isVerified) {
      throw new UnauthorizedException('user not verified');
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
