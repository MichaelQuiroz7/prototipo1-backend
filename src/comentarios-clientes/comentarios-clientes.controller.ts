import { Body, Controller, Get, Post } from '@nestjs/common';
import { ComentariosClientesService } from './comentarios-clientes.service';
import { ComentarioCliente, CreateComentarioDto } from './dtoComentarios/comentario_entity';
import { ResponseModel } from 'src/Model/response_model';

@Controller('comentariosClientes')
export class ComentariosClientesController {
  constructor(
    private readonly comentariosClientesService: ComentariosClientesService,
  ) {}

  // =====================================
  // Obtener todos los comentarios de clientes
  // =====================================
  @Get('obtenerComentarios')
  async obtenerComentarios(): Promise<ResponseModel> {
    return this.comentariosClientesService.obtenerComentariosClientes();
  }

  // =====================================
  // Crear comentario de cliente
  // =====================================
  @Post('AgregarComentario')
  async crearComentario(
    @Body() data: CreateComentarioDto,
  ): Promise<ResponseModel> {
    return this.comentariosClientesService.crearComentarioCliente(data);
  }


}