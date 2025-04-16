import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: {
    email: string;
    password: string;
  }): Promise<{ id: string; email: string; role: string }> {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async findByEmail(email: string): Promise<{
    id: string;
    email: string;
    role: string;
    password: string;
  } | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        password: true,
      },
    });
  }

  async findById(
    id: string,
  ): Promise<{ id: string; email: string; role: string } | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}
