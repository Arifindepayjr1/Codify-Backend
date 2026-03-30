import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ClassroomRepository } from '../domain/classroom.repository';
import { Classroom } from '../domain/classroom.entity';
import { Role } from '../domain/role.enum';
import { ClassroomWithStudents } from '../application/types/classroom.types';

@Injectable()
export class ClassroomRepositoryPrisma implements ClassroomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(classroom: Classroom, creatorId: number): Promise<Classroom> {
    const result = await this.prisma.$transaction(async (tx) => {
      const created = await tx.classroom.create({
        data: {
          class_code: classroom.classCode,
          name: classroom.name,
          description: classroom.description ?? null,
        },
      });

      await tx.classroomUser.create({
        data: {
          classroom_id: created.id,
          user_id: creatorId,
          role: Role.OWNER,
        },
      });

      return created;
    });

    return Classroom.rehydrate({
      id: result.id,
      classCode: result.class_code,
      name: result.name,
      description: result.description ?? undefined,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }

  async findAllByUser(userId: number): Promise<ClassroomWithStudents[]> {
    const results = await this.prisma.classroom.findMany({
      where: {
        users: {
          some: { user_id: userId },
        },
      },
      include: {
        users: {
          where: { user_id: userId },
          select: { role: true },
        },
        _count: {
          select: {
            users: {
              where: {
                role: 'STUDENT',
              },
            },
          },
        },
      },
    });

    return results;
  }

  async findById(classroomId: number): Promise<Classroom | null> {
    const result = await this.prisma.classroom.findUnique({
      where: { id: classroomId },
    });

    return result ? Classroom.rehydrate({
      id: result.id,
      classCode: result.class_code,
      name: result.name,
      description: result.description ?? undefined,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    }) : null;
  }

  async findByIdWithDetails(id: number, userId: number): Promise<ClassroomWithStudents | null> {
    const result = await this.prisma.classroom.findFirst({
      where: {
        id,
        users: {
          some: {
            user_id: userId,
          }
        }
      },
      include: {
        users: {
          where: {
            user_id: userId
          },
          select: {
            role: true,
          },
        },
        _count: {
          select: {
            users: {
              where: {
                role: 'STUDENT',
              },
            },
          },
        },
      },
    });

    if (!result) return null;

    const role = result.users[0]?.role;

    return result;
  }

  async findByClassCode(classCode: string): Promise<Classroom | null> {
    if (!classCode) return null;

    const result = await this.prisma.classroom.findUnique({ where: { class_code: classCode } });
    if (!result) return null;

    return Classroom.rehydrate({
      id: result.id,
      classCode: result.class_code,
      name: result.name,
      description: result.description ?? undefined,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }

  async update(classroom: Classroom): Promise<void> {
    await this.prisma.classroom.update({
      where: { id: classroom.id! },
      data: {
        name: classroom.name,
        description: classroom.description ?? null,
        updated_at: classroom.updatedAt,
      },
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.classroom.delete({ where: { id } });
  }
}
