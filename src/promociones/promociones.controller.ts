import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PromocionesService } from './promociones.service';
import { ResponseModel } from 'src/Model/response_model';
import { CreatePromocionDto, UpdatePromocionDto } from './dto/promocion_entity';

@Controller('promociones')
export class PromocionesController {
  constructor(
    private readonly promocionesService: PromocionesService,
  ) { }

  // =====================================
  // Obtener promociones
  // =====================================
  @Get('obtenerPromociones')
  async obtenerPromociones(): Promise<ResponseModel> {
    return this.promocionesService.obtenerPromociones();
  }

  // =====================================
  // Crear promoción
  // =====================================
  @Post('crearPromocion')
  async crearPromocion(
    @Body() data: CreatePromocionDto,
  ) {
    return this.promocionesService.crearPromocion(data);
  }

  // =====================================
  // Actualizar promoción
  // =====================================
  @Put('actualizarPromocion')
  async actualizarPromocion(
    @Body() data: UpdatePromocionDto,
  ): Promise<ResponseModel> {
    return this.promocionesService.actualizarPromocion(data);
  }

  // =====================================
  // Eliminar promoción (soft delete)
  // =====================================
  @Delete('eliminarPromocion/:id')
  async eliminarPromocion(
    @Param('id') id: string,
  ): Promise<ResponseModel> {
    return this.promocionesService.eliminarPromocion(Number(id));
  }

}
