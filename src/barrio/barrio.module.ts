import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarrioService } from './barrio.service';
import { BarrioController } from './barrio.controller';
import { Barrio } from './entities/barrio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Barrio])],
  controllers: [BarrioController],
  providers: [BarrioService],
})
export class BarrioModule {}
