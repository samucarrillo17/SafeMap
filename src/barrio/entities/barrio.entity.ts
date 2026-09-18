import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Calificacion } from '../../calificacion/entities/calificacion.entity';


@Entity('barrios')
export class Barrio {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true })
  nombre!: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Polygon',
    srid: 4326,
  })
  geometria!: string;

  @Column({ type: 'float', default: 1.0 })
  puntaje_promedio!: number;

  @Column({ type: 'text', default: 'VERDE' })
  estado_semaforo!: string;

  @OneToMany(() => Calificacion, (calificacion) => calificacion.barrio)
  calificacion!: Calificacion[];
}
