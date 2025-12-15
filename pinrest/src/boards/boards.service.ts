import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto, UpdateBoardDto } from './dto';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createBoardDto: CreateBoardDto) {
    return this.prisma.board.create({
      data: {
        ...createBoardDto,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: { pins: true },
        },
      },
    });
  }

  async findAll(userId?: number) {
    const where = userId
      ? { OR: [{ isPrivate: false }, { userId }] }
      : { isPrivate: false };

    return this.prisma.board.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: { pins: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId?: number) {
    const board = await this.prisma.board.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        pins: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            _count: {
              select: { likes: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { pins: true },
        },
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    // Check if board is private and user is not the owner
    if (board.isPrivate && board.userId !== userId) {
      throw new ForbiddenException('This board is private');
    }

    return board;
  }

  async update(id: number, userId: number, updateBoardDto: UpdateBoardDto) {
    const board = await this.prisma.board.findUnique({
      where: { id },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    if (board.userId !== userId) {
      throw new ForbiddenException('You can only update your own boards');
    }

    return this.prisma.board.update({
      where: { id },
      data: updateBoardDto,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: { pins: true },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const board = await this.prisma.board.findUnique({
      where: { id },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    if (board.userId !== userId) {
      throw new ForbiddenException('You can only delete your own boards');
    }

    await this.prisma.board.delete({
      where: { id },
    });

    return { message: 'Board deleted successfully' };
  }
}
