import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AssignmentChallengeDto } from './assignment-challenge.dto';

export class AssignmentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  classroom_id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  due_at: Date;

  @ApiProperty()
  is_published: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ type: [AssignmentChallengeDto] })
  @Type(() => AssignmentChallengeDto)
  assignmentChallenges: AssignmentChallengeDto[];
}