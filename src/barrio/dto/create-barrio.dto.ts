import { IsNotEmpty, IsString } from 'class-validator';
import { IsGeoJSON } from '../decorator/is-geojson.decorator';
import type { Geometry } from 'geojson';


export class CreateBarrioDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;


  @IsNotEmpty()
  @IsGeoJSON()
  geometria!: Geometry;
}
