import { ClassroomWithStudents } from "../application/types/classroom.types";
import { Classroom } from "./classroom.entity";

export interface ClassroomRepository {
  create(classroom: Classroom, creatorId: number): Promise<Classroom>;
  findById(classroomId: number): Promise<Classroom | null>;
  findByIdWithDetails(id: number, userId: number): Promise<ClassroomWithStudents | null>;
  findByClassCode(code: string): Promise<Classroom | null>;
  findAllByUser(userId: number): Promise<ClassroomWithStudents[]>;
  update(classroom: Classroom): Promise<void>;
  deleteById(id: number): Promise<void>;
}
