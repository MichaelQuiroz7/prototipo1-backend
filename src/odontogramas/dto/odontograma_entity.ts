import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn,} from 'typeorm';
import { Cliente } from 'src/clientes/dtoCliente/cliente_entity';
import { OdontogramaDetalle } from './odontograma_detalle';

@Entity('odontograma')
export class Odontograma {
  @PrimaryGeneratedColumn({ name: 'id_odontograma' })
  idOdontograma: number;

  @Column({ name: 'id_cliente', type: 'int' })
  idCliente: number;

  @ManyToOne(() => Cliente, (cli) => cli.odontogramas)
  @JoinColumn({ name: 'id_cliente' })  
  cliente: Cliente;

  @Column({
    name: 'fecha_registro',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaRegistro: Date;

  @Column({ name: 'observaciones_generales', type: 'text', nullable: true })
  observacionesGenerales: string;

  @Column({ name: 'eliminado', type: 'boolean', default: false })
  eliminado: boolean;

  @OneToMany(() => OdontogramaDetalle, (det) => det.odontograma)
  detalles: OdontogramaDetalle[];
}
