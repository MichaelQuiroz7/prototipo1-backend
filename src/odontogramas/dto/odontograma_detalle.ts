import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Odontograma } from './odontograma_entity';
import { CatalogoDientes } from './catalogo_dientes_entity';
import { OdontoColor } from './odontocolor_entity';


@Entity('odontograma_detalle')
export class OdontogramaDetalle {
  @PrimaryGeneratedColumn({ name: 'id_detalle' })
  idDetalle: number;

  @Column({ name: 'id_odontograma', type: 'int' })
  idOdontograma: number;

  @Column({ name: 'id_diente', type: 'int' })
  idDiente: number;

  @Column({ name: 'id_color', type: 'int' })
  idColor: number;

  @Column({ name: 'estado', type: 'varchar', length: 200 })
  estado: string;

  @Column({ name: 'observacion', type: 'text', nullable: true })
  observacion: string;

  @Column({ name: 'eliminado', type: 'boolean', default: false })
  eliminado: boolean;

  // ======================================
  // RELACIONES CORRECTAS
  // ======================================

  @ManyToOne(() => Odontograma, (odo) => odo.detalles)
  @JoinColumn({ name: 'id_odontograma' })   
  odontograma: Odontograma;

  @ManyToOne(() => CatalogoDientes, (diente) => diente.detalles)
  @JoinColumn({ name: 'id_diente' })      
  diente: CatalogoDientes;

  @ManyToOne(() => OdontoColor, (color) => color.detalles)
  @JoinColumn({ name: 'id_color' })       
  color: OdontoColor;
}
