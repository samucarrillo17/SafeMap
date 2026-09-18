import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBarrioDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  geometria!: string;
}
