import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCalificacionDto {
  @IsInt()
  @Min(1)
  @Max(5)
  estrellas!: number;

  @IsBoolean()
  fue_victima!: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  comentario?: string;
}
