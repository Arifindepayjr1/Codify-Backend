import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'Classroom' })
export class ClassroomDto {
  // @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Flutter 101' })
  name: string;

  @ApiProperty({ example: 'AJ24-KL3P' })
  classCode: string;

  @ApiProperty({
    example: 'Introductory Flutter class for freshmen',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 'OWNER OR TEACHER OR STUDENT' })
  role?: String;

  @ApiProperty({ example: '10' })
  student?: number;
}
