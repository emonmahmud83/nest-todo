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

  async findAll() {
    return await this.prisma.client.todo.findMany();
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

  async update(id: string, updateTodo: UpdateTodoDto) {
    const todo = await this.prisma.client.todo.findUnique({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return this.prisma.client.todo.update({
      where: { id },
      data: updateTodo,
    });
  }

  async remove(id: string) {
    const todo = await this.prisma.client.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return this.prisma.client.todo.delete({
      where: { id },
    });
  }
}
