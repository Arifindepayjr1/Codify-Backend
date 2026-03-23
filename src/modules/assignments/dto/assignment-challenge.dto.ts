import { ApiProperty } from '@nestjs/swagger';

export class AssignmentChallengeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  assignment_id: number;

  @ApiProperty()
  original_challenge_id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  starter_code: string;

  @ApiProperty()
  language: string;

  @ApiProperty({ example: 'MEDIUM' })
  difficulty: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}