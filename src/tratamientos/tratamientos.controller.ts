
import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TratamientosService } from './tratamientos.service';
import { Tratamiento } from './dtos/tratamiento.entity';
import { Especialidad } from './dtos/especialidad.entity';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tratamientos')
export class TratamientosController {
  constructor(private readonly tratamientosService: TratamientosService) {}


  // ===========================================================
  // TRATAMIENTOS
  // ===========================================================

  @Get('obtenerTratamientos')
  async getAllTratamientos() {
    return this.tratamientosService.findAllTratamiento();
  }

  @Get('tratamiento/:id')
  async getTratamientoById(@Param('id') id: number) {
    return this.tratamientosService.findOneTratamiento(id);
  }

  /**
   * Crea un nuevo tratamiento con imagen (si se envía)
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = './recursos/tratamientos';
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `tratamiento-${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createTratamiento(
    @Body() data: Partial<Tratamiento>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      data.Imagen = `/recursos/tratamientos/${file.filename}`;
    }
    return this.tratamientosService.createTratamiento(data);
  }

  /**
   *  Actualiza un tratamiento (con o sin nueva imagen)
   */
  @Patch('tratamiento/:id')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = './recursos/tratamientos';
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `tratamiento-${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateTratamiento(
    @Param('id') id: number,
    @Body() data: Partial<Tratamiento>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      data.Imagen = `/recursos/tratamientos/${file.filename}`;
    }
    return this.tratamientosService.updateTratamiento(id, data);
  }

  /**
   * Eliminado lógico de tratamiento
   */
  @Delete('tratamiento/delete/:id')
  async deleteTratamiento(@Param('id') id: number) {
    return this.tratamientosService.deleteLogicTratamiento(id);
  }

  // ===========================================================
  //  ESPECIALIDADES
  // ===========================================================

  @Get('obtenerEspecialidades')
  async getAllEspecialidades() {
    return this.tratamientosService.findAllEspecialidades();
  }

  @Get('especialidad/:id')
  async getEspecialidadById(@Param('id') id: number) {
    return this.tratamientosService.findOneEspecialidad(id);
  }

  /**
   * Crear una nueva especialidad con imagen (si se envía)
   */
  @Post('especialidad')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = './recursos/especialidades';
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `especialidad-${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createEspecialidad(
    @Body() data: Partial<Especialidad>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      data.Imagen = `/recursos/especialidades/${file.filename}`;
    }
    return this.tratamientosService.createEspecialidad(data);
  }

  /**
   *  Actualiza una especialidad (con o sin nueva imagen)
   */
  @Patch('especialidad/:id')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = './recursos/especialidades';
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `especialidad-${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateEspecialidad(
    @Param('id') id: number,
    @Body() data: Partial<Especialidad>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      data.Imagen = `/recursos/especialidades/${file.filename}`;
    }
    return this.tratamientosService.updateEspecialidad(id, data);
  }

  /**
   * Eliminado lógico de especialidad
   */
  @Delete('especialidad/delete/:id')
  async deleteEspecialidad(@Param('id') id: number) {
    return this.tratamientosService.deleteLogicEspecialidad(id);
  }
}



