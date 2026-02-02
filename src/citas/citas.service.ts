import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CitaEntity } from './dto/cita.dto';
import { CreateCitaDto } from './dto/create_cita.dto';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(CitaEntity)
    private readonly citaRepo: Repository<CitaEntity>,
  ) { }

  // =====================================
  // Crear cita
  // =====================================
  async create(data: CreateCitaDto): Promise<CitaEntity> {
    try {
      const nueva = this.citaRepo.create({
        ...data,
        estado: data.estado ?? 'pendiente',
        eliminado: false,
      });

      return await this.citaRepo.save(nueva);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la cita');
    }
  }

  // =====================================
  // Obtener todas las citas
  // =====================================
  async findAll(): Promise<CitaEntity[]> {
    return this.citaRepo.find({
      where: { eliminado: false },
      order: { fecha: 'ASC', horaInicio: 'ASC' },
    });
  }

  // =====================================
  // Obtener todas las citas sin filtros
  // =====================================
  async encontrarTodas(): Promise<CitaEntity[]> {
    return this.citaRepo.find({
      order: { fecha: 'ASC', horaInicio: 'ASC' },
    });
  }

  // =====================================
  // Obtener cita por ID
  // =====================================
  async findOne(id: number): Promise<CitaEntity> {
    const cita = await this.citaRepo.findOne({
      where: { idCita: id },
    });

    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    }

    return cita;
  }

  // =====================================
  // Obtener citas por cliente
  // =====================================
  async obtenerCitasPorCliente(idCliente: number): Promise<CitaEntity[]> {
    const citas = await this.citaRepo.find({
      where: { idCliente },
      order: { fecha: 'ASC' },
    });

    if (!citas.length) {
      throw new NotFoundException(
        `El cliente ${idCliente} no tiene citas registradas`,
      );
    }

    return citas;
  }

  // =====================================
  // Actualizar cita
  // =====================================
  async update(id: number, data: Partial<CitaEntity>): Promise<CitaEntity> {
    const cita = await this.findOne(id);
    Object.assign(cita, data);
    return this.citaRepo.save(cita);
  }

  // =====================================
  // Eliminado lógico
  // =====================================

  async cancelar(id: number): Promise<void> {
    const cita = await this.findOne(id);

    cita.eliminado = true;
    cita.estado = 'cancelada';

    await this.citaRepo.save(cita);
  }

  async reagendar(id: number): Promise<void> {
    const cita = await this.findOne(id);

    cita.eliminado = true;
    cita.estado = 'reagendada';

    await this.citaRepo.save(cita);
  }

  async noasitio(id: number): Promise<void> {
    const cita = await this.findOne(id);

    cita.eliminado = true;
    cita.estado = 'no_asistio';

    await this.citaRepo.save(cita);
  }


}
