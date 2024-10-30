import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ParamsDTO {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
