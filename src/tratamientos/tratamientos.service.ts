import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Tratamiento } from './dtos/tratamiento.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Especialidad } from './dtos/especialidad.entity';

@Injectable()
export class TratamientosService {
  constructor(
    @InjectRepository(Tratamiento)
    private readonly tratamientoRepo: Repository<Tratamiento>,

    @InjectRepository(Especialidad)
    private readonly especialidadRepo: Repository<Especialidad>,
  ) {}

  // ===========================================================
  //  TRATAMIENTOS
  // ===========================================================

  /**
   * Obtener todos los tratamientos no eliminados.
   */
  async findAllTratamiento(): Promise<Tratamiento[]> {
    try {
      return await this.tratamientoRepo.find({
        where: { Eliminado: false },
        order: { IdTratamiento: 'ASC' },
        relations: ['Especialidad'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener tratamientos');
    }
  }

  /**
   * Buscar un tratamiento por ID.
   */
  async findOneTratamiento(id: number): Promise<Tratamiento> {
    const tratamiento = await this.tratamientoRepo.findOne({
      where: { IdTratamiento: id, Eliminado: false },
      relations: ['Especialidad'],
    });

    if (!tratamiento) {
      throw new NotFoundException(`No se encontró el tratamiento con ID ${id}`);
    }

    return tratamiento;
  }

  /**
   * Crear un nuevo tratamiento.
   */
  async createTratamiento(data: Partial<Tratamiento>): Promise<Tratamiento> {
    try {
      const nuevo = this.tratamientoRepo.create(data);
      return await this.tratamientoRepo.save(nuevo);
    } catch (error) {
      console.error(' Error al crear tratamiento:', error);
      throw new InternalServerErrorException('Error al crear tratamiento');
    }
  }

  /**
   * Actualizar un tratamiento existente.
   */
  async updateTratamiento(id: number, data: Partial<Tratamiento>): Promise<Tratamiento> {
    const tratamiento = await this.findOneTratamiento(id);
    if (!tratamiento) {
      throw new NotFoundException(`Tratamiento con ID ${id} no encontrado`);
    }

    Object.assign(tratamiento, data);

    try {
      await this.tratamientoRepo.save(tratamiento);
      return tratamiento;
    } catch (error) {
      console.error(' Error al actualizar tratamiento:', error);
      throw new InternalServerErrorException('Error al actualizar tratamiento');
    }
  }

  /**
   * Eliminado lógico de tratamiento.
   */
  async deleteLogicTratamiento(id: number): Promise<{ message: string }> {
    const tratamiento = await this.findOneTratamiento(id);
    if (!tratamiento) {
      throw new NotFoundException(`Tratamiento con ID ${id} no encontrado`);
    }

    tratamiento.Eliminado = true;
    await this.tratamientoRepo.save(tratamiento);

    return { message: `Tratamiento ${id} eliminado lógicamente` };
  }

  // ===========================================================
  //  ESPECIALIDADES
  // ===========================================================

  /**
   * Obtener todas las especialidades no eliminadas.
   */
  async findAllEspecialidades(): Promise<Especialidad[]> {
    try {
      return await this.especialidadRepo.find({
        where: { Eliminado: false },
        order: { IdEspecialidad: 'ASC' },
        relations: ['Tratamientos'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener especialidades');
    }
  }

  /**
   * Buscar una especialidad por ID.
   */
  async findOneEspecialidad(id: number): Promise<Especialidad> {
    const especialidad = await this.especialidadRepo.findOne({
      where: { IdEspecialidad: id, Eliminado: false },
      relations: ['Tratamientos'],
    });

    if (!especialidad) {
      throw new NotFoundException(`No se encontró la especialidad con ID ${id}`);
    }

    return especialidad;
  }

  /**
   * Crear una nueva especialidad.
   */
  async createEspecialidad(data: Partial<Especialidad>): Promise<Especialidad> {
    try {
      const nueva = this.especialidadRepo.create(data);
      return await this.especialidadRepo.save(nueva);
    } catch (error) {
      console.error(' Error al crear especialidad:', error);
      throw new InternalServerErrorException('Error al crear especialidad');
    }
  }

  /**
   * Actualizar una especialidad existente.
   */
  async updateEspecialidad(id: number, data: Partial<Especialidad>): Promise<Especialidad> {
    const especialidad = await this.findOneEspecialidad(id);
    if (!especialidad) {
      throw new NotFoundException(`Especialidad con ID ${id} no encontrada`);
    }

    Object.assign(especialidad, data);

    try {
      await this.especialidadRepo.save(especialidad);
      return especialidad;
    } catch (error) {
      console.error('❌ Error al actualizar especialidad:', error);
      throw new InternalServerErrorException('Error al actualizar especialidad');
    }
  }

  /**
   * Eliminado lógico de especialidad.
   */
  async deleteLogicEspecialidad(id: number): Promise<{ message: string }> {
    const especialidad = await this.findOneEspecialidad(id);
    if (!especialidad) {
      throw new NotFoundException(`Especialidad con ID ${id} no encontrada`);
    }

    especialidad.Eliminado = true;
    await this.especialidadRepo.save(especialidad);

    return { message: `Especialidad ${id} eliminada lógicamente` };
  }
}



