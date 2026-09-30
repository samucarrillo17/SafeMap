import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { handleDBException } from '../common/helpers/handleDbException';
import { CreateBarrioDto } from './dto/create-barrio.dto';
import { UpdateBarrioDto } from './dto/update-barrio.dto';
import { Barrio } from './entities/barrio.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BarrioService {
  constructor(
    @InjectRepository(Barrio)
    private readonly barriosRepository: Repository<Barrio>,
  ) {}

  async create(createBarrioDto: CreateBarrioDto): Promise<Barrio> {
    try {
      const barrio = this.barriosRepository.create(createBarrioDto);

      return await this.barriosRepository.save(barrio);
    } catch (error) {
      handleDBException(error);
    }
  }

  async findAll(): Promise<Barrio[]> {
    const barrios = await this.barriosRepository.find();

    return barrios;
  }

  async seedBarrios() {
    const filePath = path.join(
      process.cwd(),
      'src/common/data/barrios_barranquilla.geojson',
    );
    const fileData = fs.readFileSync(filePath, 'utf8');
    const geojson = JSON.parse(fileData);


    const nombresProcesados = new Set<string>();
    const barriosToSave: DeepPartial<Barrio>[] = [];

   
    for (const feature of geojson.features) {
      const nombreBarrio =
        feature.properties.nombre_barrio || feature.properties.NOMBRE;
      const geometriaLimpia = feature.geometry;

      if (nombreBarrio && geometriaLimpia) {
       
        const nombreClave = nombreBarrio.trim().toLowerCase();

        
        if (!nombresProcesados.has(nombreClave)) {
          nombresProcesados.add(nombreClave);

          const barrio = this.barriosRepository.create({
            nombre: nombreBarrio.trim(),
            geometria: geometriaLimpia,
          });
          barriosToSave.push(barrio);
        }
      }
    }

    // 3. Guardar en base de datos
    await this.barriosRepository.save(barriosToSave);

    return {
      message: `Seeding completado con éxito. Se insertaron ${barriosToSave.length} barrios.`,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} barrio`;
  }

  update(id: number, updateBarrioDto: UpdateBarrioDto) {
    return `This action updates a #${id} barrio`;
  }

  remove(id: number) {
    return `This action removes a #${id} barrio`;
  }
}
