import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BarrioService } from './barrio.service';
import { CreateBarrioDto } from './dto/create-barrio.dto';
import { UpdateBarrioDto } from './dto/update-barrio.dto';
import { Auth } from '../auth/decorator/auth.decorator';

@Controller('barrio')
export class BarrioController {
  constructor(private readonly barrioService: BarrioService) {}

  @Post()
  @Auth()
  create(@Body() createBarrioDto: CreateBarrioDto) {
    return this.barrioService.create(createBarrioDto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.barrioService.findAll();
  }

  @Post('seed')
  seedBarrios() {
    return this.barrioService.seedBarrios();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.barrioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBarrioDto: UpdateBarrioDto) {
    return this.barrioService.update(+id, updateBarrioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.barrioService.remove(+id);
  }
}
