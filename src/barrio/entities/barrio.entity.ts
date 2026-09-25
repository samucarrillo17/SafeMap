import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Calificacion } from '../../calificacion/entities/calificacion.entity';
import type{ Geometry } from 'geojson';


@Entity('barrios')
export class Barrio {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text', unique: true })
  nombre!: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Polygon',
    srid: 4326,
  })
  geometria!: Geometry;

  @Column({ type: 'float', default: 1.0 })
  puntaje_promedio!: number;

  @Column({ type: 'text', default: 'VERDE' })
  estado_semaforo!: string;

  @Column({ type: 'int', default: 0 })
  contador_calificaciones!: number;

  @OneToMany(() => Calificacion, (calificacion) => calificacion.barrio)
  calificacion!: Calificacion[];
}
