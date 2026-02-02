import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OdontoColor } from './dto/odontocolor_entity';
import { CatalogoDientes } from './dto/catalogo_dientes_entity';
import { Odontograma } from './dto/odontograma_entity';
import { OdontogramaDetalle } from './dto/odontograma_detalle';


@Injectable()
export class OdontogramasService {
  constructor(
    @InjectRepository(OdontoColor)
    private readonly colorRepo: Repository<OdontoColor>,

    @InjectRepository(CatalogoDientes)
    private readonly dienteRepo: Repository<CatalogoDientes>,

    @InjectRepository(Odontograma)
    private readonly odontogramaRepo: Repository<Odontograma>,

    @InjectRepository(OdontogramaDetalle)
    private readonly detalleRepo: Repository<OdontogramaDetalle>,
  ) { }

  // ============================================================
  //     1. COLORES ODONTOLOGICOS
  // ============================================================

  async obtenerTodosColores(): Promise<OdontoColor[]> {
    return this.colorRepo.find({
      where: { eliminado: false },
      order: { idColor: 'ASC' },
    });
  }

  // ============================================================
  //     2. CATALOGO DE DIENTES
  // ============================================================

  async obtenerCatalogoDientes(): Promise<CatalogoDientes[]> {
    return this.dienteRepo.find({
      where: { eliminado: false },
      order: { idDiente: 'ASC' },
    });
  }

  // ============================================================
  //     3. CRUD ODONTOGRAMA
  // ============================================================

  async obtenerOdontogramas(): Promise<Odontograma[]> {
    return this.odontogramaRepo.find({
      where: { eliminado: false },
      relations: ['detalles', 'detalles.color', 'detalles.diente'],
    });
  }

  async obtenerOdontogramaPorId(id: number): Promise<Odontograma> {
    const odo = await this.odontogramaRepo.findOne({
      where: { idOdontograma: id, eliminado: false },
      relations: ['detalles', 'detalles.color', 'detalles.diente'],
    });

    if (!odo) {
      throw new NotFoundException(`Odontograma con ID ${id} no encontrado`);
    }

    return odo;
  }

  async obtenerOdontogramaPorCliente(idCliente: number): Promise<Odontograma> {
    const odo = await this.odontogramaRepo.findOne({
      where: {
        idCliente: idCliente,
        eliminado: false,
      },
      relations: [
        'detalles',
        'detalles.color',
        'detalles.diente',
      ],
      order: {
        idOdontograma: 'DESC',
      },
    });

    if (!odo) {
      throw new NotFoundException(`El cliente ${idCliente} no tiene odontograma registrado`);
    }

    return odo;
  }


  async crearOdontograma(data: Partial<Odontograma>): Promise<Odontograma> {
    const nuevo = this.odontogramaRepo.create(data);
    return this.odontogramaRepo.save(nuevo);
  }

  async actualizarOdontograma(id: number, data: Partial<Odontograma>): Promise<Odontograma> {
    const odo = await this.obtenerOdontogramaPorId(id);
    Object.assign(odo, data);
    return this.odontogramaRepo.save(odo);
  }

  async eliminarOdontograma(id: number): Promise<void> {
    const odo = await this.obtenerOdontogramaPorId(id);
    odo.eliminado = true;
    await this.odontogramaRepo.save(odo);
  }

  // ============================================================
  //     4. CRUD ODONTOGRAMA DETALLE
  // ============================================================

  async obtenerDetallePorId(id: number): Promise<OdontogramaDetalle> {
    const detalle = await this.detalleRepo.findOne({
      where: { idDetalle: id, eliminado: false },
      relations: ['odontograma', 'color', 'diente'],
    });

    if (!detalle) {
      throw new NotFoundException(`Detalle con ID ${id} no encontrado`);
    }

    return detalle;
  }

  async crearDetalle(data: Partial<OdontogramaDetalle>): Promise<OdontogramaDetalle> {
    const nuevo = this.detalleRepo.create(data);
    return this.detalleRepo.save(nuevo);
  }

  async actualizarDetalle(
    id: number,
    data: Partial<OdontogramaDetalle>
  ): Promise<OdontogramaDetalle> {

    const detalle = await this.obtenerDetallePorId(id);

    // Si viene un nuevo color, actualizar correctamente la FK
    if (data.idColor) {
      const nuevoColor = await this.colorRepo.findOne({
        where: { idColor: data.idColor, eliminado: false }
      });

      if (!nuevoColor) {
        throw new NotFoundException(`Color con id ${data.idColor} no existe.`);
      }

      detalle.color = nuevoColor;
      detalle.idColor = data.idColor;
    }

    if (data.estado !== undefined) detalle.estado = data.estado;
    if (data.observacion !== undefined) detalle.observacion = data.observacion;
    if (data.idDiente !== undefined) detalle.idDiente = data.idDiente;

    await this.detalleRepo.save(detalle);

    return this.detalleRepo.findOneOrFail({
      where: { idDetalle: id },
      relations: ['color', 'diente']
    });
  }



  async eliminarDetalle(id: number): Promise<void> {
    const detalle = await this.obtenerDetallePorId(id);
    detalle.eliminado = true;
    await this.detalleRepo.save(detalle);
  }
}
