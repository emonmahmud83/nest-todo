import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly prisma: PrismaClient;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    this.prisma = new PrismaClient({
      adapter,
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    this.logger.log('[INIT] Prisma connecting...');
    await this.prisma.$connect();
    this.logger.log('[INIT] Prisma connected');
  }

  async onModuleDestroy() {
    this.logger.log('[DESTROY] Prisma disconnecting...');
    await this.prisma.$disconnect();
    this.logger.log('[DESTROY] Prisma disconnected');
  }

  get client() {
    return this.prisma;
  }
}
