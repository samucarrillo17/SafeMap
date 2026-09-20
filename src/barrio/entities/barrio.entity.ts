import { Entity, PrimaryGeneratedColumn, Column, OneToMany, VirtualColumn } from 'typeorm';
import { Calificacion } from '../../calificacion/entities/calificacion.entity';
import type{ Geometry } from 'geojson';


@Entity('barrios')
export class Barrio {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT(*) FROM "calificaciones" WHERE "barrio_id" = ${alias}.id`,
  })
  contadorCalificaciones?: number;

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

  @OneToMany(() => Calificacion, (calificacion) => calificacion.barrio)
  calificacion!: Calificacion[];
}
