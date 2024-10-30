import { IsString, IsNotEmpty } from 'class-validator';

export class JobApplicationCommentDTO {
  @IsString()
  @IsNotEmpty()
  content: string;
}
