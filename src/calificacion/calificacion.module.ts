import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalificacionService } from './calificacion.service';
import { CalificacionController } from './calificacion.controller';
import { Calificacion } from './entities/calificacion.entity';
import { BarrioModule } from '../barrio/barrio.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    BarrioModule,
    TypeOrmModule.forFeature([Calificacion]),
    ConfigModule
  ],
  controllers: [CalificacionController],
  providers: [CalificacionService]
})
export class CalificacionModule {}
