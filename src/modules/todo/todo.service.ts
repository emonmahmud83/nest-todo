import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}
  create(createTodoDto: CreateTodoDto) {
    return this.prisma.client.todo.create({
      data: createTodoDto,
    });
  }

  findAll() {
    return `This action returns all todo`;
  }

  async findOne(id: string) {
    try {
      const todo = await this.prisma.client.todo.findUnique({ where: { id } });
      if (!todo) {
        throw new NotFoundException(`Todo with ID ${id} not found`);
      }
      return todo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    try {
      const todo = await this.prisma.client.todo.findUnique({ where: { id } });
      if (!todo) {
        throw new Error('Todo not found');
      }
      return this.prisma.client.todo.update({
        where: { id },
        data: updateTodoDto,
      });
    } catch {
      throw new Error('Todo not found');
    }
  }

  remove(id) {
    return `This action removes a #${id} todo`;
  }
}
