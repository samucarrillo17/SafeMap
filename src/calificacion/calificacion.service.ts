import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { handleDBException } from '../common/helpers/handleDbException';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { Calificacion } from './entities/calificacion.entity';
import { Barrio } from '../barrio/entities/barrio.entity';

@Injectable()
export class CalificacionService {
  constructor(
    @InjectRepository(Calificacion)
    private readonly calificacionesRepository: Repository<Calificacion>,
    @InjectRepository(Barrio)
    private readonly barrioRepository: Repository<Barrio>,
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

      const calificacionGuardada = await this.calificacionesRepository.save(calificacion);
      await this.updateBarrioMetrics(barrioId)
      return calificacionGuardada;
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

  private async updateBarrioMetrics(barrioId: string): Promise<void> {
    const stats = await this.calificacionesRepository
      .createQueryBuilder('c')
      .select('COUNT(c.id)', 'count')
      .addSelect('AVG(c.estrellas)', 'avg')
      .where('c.barrio_id = :barrioId', { barrioId })
      .getRawOne();

    const total = parseInt(stats?.count || '0', 10);
    const promedio = parseFloat(parseFloat(stats?.avg || '0').toFixed(2));

    await this.barrioRepository.update(barrioId, {
      contador_calificaciones: total,
      puntaje_promedio: promedio,
    });
  }
}
