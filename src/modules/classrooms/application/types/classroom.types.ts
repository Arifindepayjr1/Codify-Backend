import { Prisma } from "@prisma/client";
import { Role } from "../../domain/role.enum";

export type ClassroomWithStudents = Prisma.ClassroomGetPayload<{
  include: {
    users: {
      where: { user_id: number },
      select: { role: true }
    },
    _count: {
      select: {
        users: {
          where: {
            role: Role.STUDENT
          }
        }
      }
    }
  }
}>;