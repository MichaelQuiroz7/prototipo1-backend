import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ComentarioCliente, CreateComentarioDto } from './dtoComentarios/comentario_entity';
import { Repository } from 'typeorm';
import { ResponseModel } from 'src/Model/response_model';
import { ResponseType } from 'src/Model/response_type';

@Injectable()
export class ComentariosClientesService {
  constructor(
    @InjectRepository(ComentarioCliente)
    private readonly comentarioRepo: Repository<ComentarioCliente>,
  ) { }

  // ============================================================
  //  Obtener todos los comentarios de clientes
  // ============================================================
  async obtenerComentariosClientes(): Promise<ResponseModel> {
    try {
      const comentarios: ComentarioCliente[] =
        await this.comentarioRepo.query(
          `SELECT * FROM fn_obtener_comentarios_clientes();`,
        );

      return new ResponseModel(
        ResponseType.Success,
        'Comentarios obtenidos correctamente',
        comentarios,
      );
    } catch (error) {
      console.error('Error al obtener comentarios de clientes:', error);

      return new ResponseModel(
        ResponseType.Error,
        'Error al obtener los comentarios de clientes',
      );
    }
  }



  // ============================================================
  //  Crear comentario de cliente (SP)
  // ============================================================
  async crearComentarioCliente(
    data: CreateComentarioDto,
  ): Promise<ResponseModel> {
    try {
      await this.comentarioRepo.query(
        `CALL sp_crear_comentario_cliente($1, $2, $3);`,
        [data.idCliente, data.puntuacion, data.feedback],
      );

      return new ResponseModel(
        ResponseType.Success,
        'Comentario registrado correctamente',
      );
    } catch (error) {
      console.error('Error al crear comentario:', error.message);

      // Error lanzado desde el PROCEDURE (no tiene citas)
      if (error.message?.includes('no tiene citas registradas')) {
        throw new BadRequestException(
          'El cliente no tiene citas registradas para comentar',
        );
      }

      throw new InternalServerErrorException(
        'Error al registrar el comentario',
      );
    }
  }





}
