import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post,} from '@nestjs/common';
import { OdontogramasService } from './odontogramas.service';
import { OdontoColor } from './dto/odontocolor_entity';
import { CatalogoDientes } from './dto/catalogo_dientes_entity';
import { Odontograma } from './dto/odontograma_entity';
import { OdontogramaDetalle } from './dto/odontograma_detalle';


@Controller('odontogramas')
export class OdontogramasController {
  constructor(private readonly odontogramaService: OdontogramasService) {}

  // ================================================================
  //  ODONTOCOLOR
  // ================================================================

  @Get('ObtenerColores')
  async obtenerColores(): Promise<OdontoColor[]> {
    return this.odontogramaService.obtenerTodosColores();
  }

  // ================================================================
  //  CATALOGO DIENTES
  // ================================================================

  @Get('ObtenerCatalogoDientes')
  async obtenerDientes(): Promise<CatalogoDientes[]> {
    return this.odontogramaService.obtenerCatalogoDientes();
  }

  // ================================================================
  //  ODONTOGRAMA
  // ================================================================

  @Get('ObtenerOdontogramas')
  async obtenerOdontogramas(): Promise<Odontograma[]> {
    return this.odontogramaService.obtenerOdontogramas();
  }

  @Get('ObtenerOdontograma/:id')
  async obtenerOdontograma(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Odontograma> {
    return this.odontogramaService.obtenerOdontogramaPorId(id);
  }

  @Get('ObtenerPorCliente/:idCliente')
async obtenerPorCliente(
  @Param('idCliente', ParseIntPipe) idCliente: number,
): Promise<Odontograma> {
  return this.odontogramaService.obtenerOdontogramaPorCliente(idCliente);
}


  @Post('AgregarOdontograma')
  async agregarOdontograma(
    @Body() data: Partial<Odontograma>,
  ): Promise<Odontograma> {
    return this.odontogramaService.crearOdontograma(data);
  }

  @Patch('ActualizarOdontograma/:id')
  async actualizarOdontograma(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Odontograma>,
  ): Promise<Odontograma> {
    return this.odontogramaService.actualizarOdontograma(id, data);
  }

  @Delete('EliminarOdontograma/:id')
  async eliminarOdontograma(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.odontogramaService.eliminarOdontograma(id);
  }

  // ================================================================
  //  ODONTOGRAMA DETALLE
  // ================================================================

  @Get('detalle/ObtenerDetalle/:id')
  async obtenerDetalle(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OdontogramaDetalle> {
    return this.odontogramaService.obtenerDetallePorId(id);
  }

  @Post('detalle/AgregarDetalle')
  async agregarDetalle(
    @Body() data: Partial<OdontogramaDetalle>,
  ): Promise<OdontogramaDetalle> {
    return this.odontogramaService.crearDetalle(data);
  }

  @Patch('detalle/ActualizarDetalle/:id')
  async actualizarDetalle(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<OdontogramaDetalle>,
  ): Promise<OdontogramaDetalle> {
    return this.odontogramaService.actualizarDetalle(id, data);
  }

  @Delete('detalle/EliminarDetalle/:id')
  async eliminarDetalle(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.odontogramaService.eliminarDetalle(id);
  }
}
