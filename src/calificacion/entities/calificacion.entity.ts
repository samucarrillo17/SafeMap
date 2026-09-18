import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Barrio } from '../../barrio/entities/barrio.entity';


@Entity('calificaciones')
@Unique(['usuario', 'barrio'])
export class Calificacion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Usuario, (user) => user.calificacion, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario!: Usuario;

  @ManyToOne(() => Barrio, (barrio) => barrio.calificacion, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'barrio_id' })
  barrio!: Barrio;

  @Column({ type: 'int' })
  estrellas!: number;

  @Column({ type: 'boolean' })
  fue_victima!: boolean;

  @Column({ type: 'text', nullable: true })
  comentario?: string;

  @CreateDateColumn()
  created_at!: Date;
}
