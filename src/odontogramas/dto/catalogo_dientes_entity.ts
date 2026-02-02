import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OdontogramaDetalle } from './odontograma_detalle';


@Entity('catalogo_dientes')
export class CatalogoDientes {
  @PrimaryGeneratedColumn({ name: 'id_diente' })
  idDiente: number;

  @Column({ name: 'diente_numero', type: 'varchar', length: 20, nullable: true })
  dienteNumero: string;

  @Column({ name: 'nombre', type: 'varchar', length: 100, nullable: true })
  nombre: string;

  @Column({ name: 'cuadrante', type: 'int', nullable: true })
  cuadrante: number;

  @Column({ name: 'tipo', type: 'varchar', length: 20, nullable: true })
  tipo: string;

  @Column({ name: 'eliminado', default: false })
  eliminado: boolean;

  @OneToMany(() => OdontogramaDetalle, det => det.diente)
  detalles: OdontogramaDetalle[];
}
