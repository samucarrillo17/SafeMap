import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Calificacion } from '../../calificacion/entities/calificacion.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', { unique: true })
  correo!: string;

  @Column('text', { select: false })
  contrasena!: string;

  @Column('text')
  nombre!: string;

  @OneToMany(() => Calificacion, (calificacion) => calificacion.usuario)
  calificacion!: Calificacion[];

  @CreateDateColumn()
  createdAt!: Date;

  @BeforeInsert()
  LOWERCASE_EMAIL() {
    if (this.correo) {
      this.correo = this.correo.trim().toLowerCase();
    }
  }

  @BeforeUpdate()
  LOWERCASE_EMAIL_UPDATE() {
    if (this.correo) {
      this.correo = this.correo.trim().toLowerCase();
    }
  }
}
