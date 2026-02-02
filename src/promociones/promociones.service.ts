import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ResponseModel } from 'src/Model/response_model';
import { ResponseType } from 'src/Model/response_type';
import { CreatePromocionDto, Promocion, UpdatePromocionDto } from './dto/promocion_entity';


@Injectable()
export class PromocionesService {
    constructor(
        @InjectRepository(Promocion)
        private readonly promocionRepo: Repository<Promocion>,
    ) { }

    // ============================================
    // Obtener promociones
    // ============================================
    async obtenerPromociones(): Promise<ResponseModel> {
        try {
            const promociones: Promocion[] =
                await this.promocionRepo.query(
                    `SELECT * FROM promocion WHERE eliminado = FALSE;`,
                );

            return new ResponseModel(
                ResponseType.Success,
                'Promociones obtenidas correctamente',
                promociones,
            );
        } catch (error) {
            console.error('Error al obtener promociones:', error);

            return new ResponseModel(
                ResponseType.Error,
                'Error al obtener promociones',
            );
        }
    }

    // =====================================
    // Crear promoción 
    // =====================================
    async crearPromocion(
        data: CreatePromocionDto,
    ): Promise<ResponseModel> {
        try {

            // 🔎 Validaciones importantes

            if (data.fechaFin <= data.fechaInicio) {
                throw new BadRequestException(
                    'La fecha fin debe ser mayor que la fecha inicio',
                );
            }

            if (data.precioAhora > data.precioAntes) {
                throw new BadRequestException(
                    'El precio promocional no puede ser mayor al original',
                );
            }

            // 🔎 Verificar si ya existe promoción activa para el tratamiento
            const promocionActiva = await this.promocionRepo.findOne({
                where: {
                    idTratamiento: data.idTratamiento,
                    eliminado: false,
                },
            });

            if (promocionActiva) {
                throw new BadRequestException(
                    'Ya existe una promoción activa para este tratamiento',
                );
            }

            const nuevaPromocion = this.promocionRepo.create({
                idTratamiento: data.idTratamiento,
                precioAntes: data.precioAntes,
                precioAhora: data.precioAhora,
                es2x1: data.es2x1,
                fechaInicio: data.fechaInicio,
                fechaFin: data.fechaFin,
                limite: data.limite ?? 10000,
            });

            await this.promocionRepo.save(nuevaPromocion);

            return new ResponseModel(
                ResponseType.Success,
                'Promoción creada correctamente',
                nuevaPromocion,
            );

        } catch (error) {
            console.error(error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException(
                'Error al registrar la promoción',
            );
        }
    }



    async actualizarPromocion(
        data: UpdatePromocionDto,
    ): Promise<ResponseModel> {
        try {

            const promocion = await this.promocionRepo.findOne({
                where: { idPromocion: data.idPromocion, eliminado: false },
            });

            if (!promocion) {
                throw new BadRequestException(
                    'La promoción no existe o fue eliminada',
                );
            }

            if (data.fechaFin <= data.fechaInicio) {
                throw new BadRequestException(
                    'La fecha fin debe ser mayor que la fecha inicio',
                );
            }

            if (data.precioAhora > data.precioAntes) {
                throw new BadRequestException(
                    'El precio promocional no puede ser mayor al original',
                );
            }

            promocion.precioAntes = data.precioAntes;
            promocion.precioAhora = data.precioAhora;
            promocion.es2x1 = data.es2x1;
            promocion.fechaInicio = data.fechaInicio;
            promocion.fechaFin = data.fechaFin;
            promocion.limite = data.limite ?? 10000;

            await this.promocionRepo.save(promocion);

            return new ResponseModel(
                ResponseType.Success,
                'Promoción actualizada correctamente',
                promocion,
            );

        } catch (error) {
            console.error(error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException(
                'Error al actualizar la promoción',
            );
        }
    }




    async eliminarPromocion(
        idPromocion: number,
    ): Promise<ResponseModel> {
        try {

            const promocion = await this.promocionRepo.findOne({
                where: { idPromocion, eliminado: false },
            });

            if (!promocion) {
                throw new BadRequestException(
                    'La promoción no existe o ya fue eliminada',
                );
            }

            promocion.eliminado = true;

            await this.promocionRepo.save(promocion);

            return new ResponseModel(
                ResponseType.Success,
                'Promoción eliminada correctamente',
            );

        } catch (error) {
            console.error(error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new InternalServerErrorException(
                'Error al eliminar la promoción',
            );
        }
    }




}
