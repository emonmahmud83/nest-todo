import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.client.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        // we exclude password by not selecting it
      },
    });
    return { success: true, message: 'Users Found Successfully', data: users };
  }

  async findOne(id: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return { success: true, message: 'User Found Successfully', data: user };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Check if user exists
    await this.findOne(id);

    const updatedUser = await this.prisma.client.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      message: 'User Updated Successfully',
      data: updatedUser,
    };
  }

  async remove(id: string) {
    // Check if user exists
    await this.findOne(id);

    await this.prisma.client.user.delete({
      where: { id },
    });

    return { success: true, message: 'User Deleted Successfully' };
  }
}
