import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CitasService } from './citas.service';
import { CitaEntity } from './dto/cita.dto';
import { CreateCitaDto } from './dto/create_cita.dto';

@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post('agendarCita')
create(@Body() createCitaDto: CreateCitaDto) {
  return this.citasService.create(createCitaDto);
}

  @Get('obtenerTodasCitas')
  findAll() {
    return this.citasService.findAll();
  }

  @Get('consultarTodas')
  encontrarTodas() {
    return this.citasService.encontrarTodas();
  }

  @Get('citaXcliente/:idCliente')
  obtenerPorCliente(
    @Param('idCliente', ParseIntPipe) idCliente: number,
  ) {
    return this.citasService.obtenerCitasPorCliente(idCliente);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.citasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCitaDto: Partial<CitaEntity>,
  ) {
    return this.citasService.update(id, updateCitaDto);
  }

  @Delete('cancelar/:id')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.citasService.cancelar(id);
  }
  @Delete('reagendar/:id')
  reagendar(@Param('id', ParseIntPipe) id: number) {
    return this.citasService.reagendar(id);
  }
  @Delete('noasistio/:id')
  noasistio(@Param('id', ParseIntPipe) id: number) {
    return this.citasService.noasitio(id);
  }
  
}
