import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.client.user.findUnique({
        where: { email: createUserDto.email },
      });
      if (user) {
        throw new BadRequestException(
          `User with email ${createUserDto.email} already exists`,
        );
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = await this.prisma.client.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: hashedPassword,
        },
      });
      const { password, ...userWithoutPassword } = newUser;
      return {
        success: true,
        message: 'User Created Successfully',
        data: userWithoutPassword,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const user = await this.prisma.client.user.findMany();
      return { success: true, message: 'User Found Successfully', data: user };
    } catch (error) {
      return { success: false, message: 'User Not Found' };
    }
  }

  async findOne(id: string) {
    return await this.prisma.client.user.findUnique({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
