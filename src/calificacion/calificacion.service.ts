import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { handleDBException } from '../common/helpers/handleDbException';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { Calificacion } from './entities/calificacion.entity';

@Injectable()
export class CalificacionService {
  constructor(
    @InjectRepository(Calificacion)
    private readonly calificacionesRepository: Repository<Calificacion>,
  ) {}

  async create(
    createCalificacionDto: CreateCalificacionDto,
    barrioId: string,
    usuarioId: string,
  ): Promise<Calificacion> {
    try {
      const calificacion = this.calificacionesRepository.create({
        ...createCalificacionDto,
        barrio: { id: barrioId },
        usuario: { id: usuarioId },
      });

      return await this.calificacionesRepository.save(calificacion);
    } catch (error) {
      handleDBException(error);
    }
  }

  async findAll(barrioId: string): Promise<Calificacion[]> {
    return this.calificacionesRepository.find({
      where: { barrio: { id: barrioId } },
      relations: { usuario: true },
    });
  }

  

  update(id: number, updateCalificacionDto: UpdateCalificacionDto) {
    return `This action updates a #${id} calificacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} calificacion`;
  }
}
