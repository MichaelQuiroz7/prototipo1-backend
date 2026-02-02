import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OdontogramaDetalle } from './odontograma_detalle';

@Entity('odontocolor')
export class OdontoColor {
  @PrimaryGeneratedColumn({ name: 'id_color' })
  idColor: number;

  @Column({ name: 'colornombre', type: 'varchar', length: 50 })
  colorNombre: string;

  @Column({ name: 'colorhex', type: 'varchar', length: 10 })
  colorHex: string;

  @Column({ name: 'uso', type: 'varchar', length: 200 })
  uso: string;

  @Column({ name: 'significadoclinico', type: 'varchar', length: 300 })
  significadoClinico: string;

  @Column({ name: 'eliminado', type: 'boolean', default: true })
  eliminado: boolean;

  // Relación con detalles
  @OneToMany(() => OdontogramaDetalle, det => det.color)
  detalles: OdontogramaDetalle[];
}
