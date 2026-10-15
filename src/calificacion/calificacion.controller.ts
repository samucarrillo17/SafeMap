import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CalificacionService } from './calificacion.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { Auth } from '../auth/decorator/auth.decorator';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('calificacion')
export class CalificacionController {
  constructor(private readonly calificacionService: CalificacionService) {}

  @Post(':barrioId')
  @Auth()
  @Throttle({ default: { limit: 5, ttl: 120 } })
  create(
    @Param('barrioId', ParseUUIDPipe) barrioId: string,
    @GetUser('id') usuarioId: string,
    @Body() createCalificacionDto: CreateCalificacionDto,
  ) {
    return this.calificacionService.create(
      createCalificacionDto,
      barrioId,
      usuarioId,
    );
  }

  @Get(':barrioId')
  @Throttle({ default: { limit: 5, ttl: 120 } })
  @Auth()
  findAll(@Param('barrioId', ParseUUIDPipe) barrioId: string) {
    return this.calificacionService.findAll(barrioId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCalificacionDto: UpdateCalificacionDto,
  ) {
    return this.calificacionService.update(+id, updateCalificacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.calificacionService.remove(+id);
  }
}
