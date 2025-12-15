import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePinDto, UpdatePinDto, SavePinDto } from './dto';

@Injectable()
export class PinsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createPinDto: CreatePinDto) {
    // Verify board belongs to user if boardId is provided
    if (createPinDto.boardId) {
      const board = await this.prisma.board.findUnique({
        where: { id: createPinDto.boardId },
      });
      if (!board || board.userId !== userId) {
        throw new ForbiddenException('You can only add pins to your own boards');
      }
    }

    return this.prisma.pin.create({
      data: {
        ...createPinDto,
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
        board: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: { likes: true },
        },
      },
    });
  }

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [pins, total] = await Promise.all([
      this.prisma.pin.findMany({
        skip,
        take: limit,
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
      }),
      this.prisma.pin.count(),
    ]);

    return {
      data: pins,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, userId?: number) {
    const pin = await this.prisma.pin.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        board: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: { likes: true, savedPins: true },
        },
      },
    });

    if (!pin) {
      throw new NotFoundException('Pin not found');
    }

    // Check if user liked or saved this pin
    let isLiked = false;
    let isSaved = false;

    if (userId) {
      const like = await this.prisma.like.findUnique({
        where: {
          userId_pinId: { userId, pinId: id },
        },
      });
      isLiked = !!like;

      const savedPin = await this.prisma.savedPin.findFirst({
        where: { userId, pinId: id },
      });
      isSaved = !!savedPin;
    }

    return { ...pin, isLiked, isSaved };
  }

  async update(id: number, userId: number, updatePinDto: UpdatePinDto) {
    const pin = await this.prisma.pin.findUnique({
      where: { id },
    });

    if (!pin) {
      throw new NotFoundException('Pin not found');
    }

    if (pin.userId !== userId) {
      throw new ForbiddenException('You can only update your own pins');
    }

    // Verify board belongs to user if boardId is provided
    if (updatePinDto.boardId) {
      const board = await this.prisma.board.findUnique({
        where: { id: updatePinDto.boardId },
      });
      if (!board || board.userId !== userId) {
        throw new ForbiddenException('You can only add pins to your own boards');
      }
    }

    return this.prisma.pin.update({
      where: { id },
      data: updatePinDto,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        board: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: { likes: true },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const pin = await this.prisma.pin.findUnique({
      where: { id },
    });

    if (!pin) {
      throw new NotFoundException('Pin not found');
    }

    if (pin.userId !== userId) {
      throw new ForbiddenException('You can only delete your own pins');
    }

    await this.prisma.pin.delete({
      where: { id },
    });

    return { message: 'Pin deleted successfully' };
  }

  async toggleLike(pinId: number, userId: number) {
    const pin = await this.prisma.pin.findUnique({
      where: { id: pinId },
    });

    if (!pin) {
      throw new NotFoundException('Pin not found');
    }

    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_pinId: { userId, pinId },
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: { id: existingLike.id },
      });
      return { message: 'Pin unliked', liked: false };
    } else {
      await this.prisma.like.create({
        data: { userId, pinId },
      });
      return { message: 'Pin liked', liked: true };
    }
  }

  async savePin(pinId: number, userId: number, savePinDto: SavePinDto) {
    const pin = await this.prisma.pin.findUnique({
      where: { id: pinId },
    });

    if (!pin) {
      throw new NotFoundException('Pin not found');
    }

    const board = await this.prisma.board.findUnique({
      where: { id: savePinDto.boardId },
    });

    if (!board || board.userId !== userId) {
      throw new ForbiddenException('You can only save pins to your own boards');
    }

    const existingSave = await this.prisma.savedPin.findUnique({
      where: {
        userId_pinId_boardId: {
          userId,
          pinId,
          boardId: savePinDto.boardId,
        },
      },
    });

    if (existingSave) {
      await this.prisma.savedPin.delete({
        where: { id: existingSave.id },
      });
      return { message: 'Pin removed from board', saved: false };
    } else {
      await this.prisma.savedPin.create({
        data: {
          userId,
          pinId,
          boardId: savePinDto.boardId,
        },
      });
      return { message: 'Pin saved to board', saved: true };
    }
  }

  async search(query: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [pins, total] = await Promise.all([
      this.prisma.pin.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        },
        skip,
        take: limit,
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
      }),
      this.prisma.pin.count({
        where: {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
          ],
        },
      }),
    ]);

    return {
      data: pins,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        query,
      },
    };
  }
}
