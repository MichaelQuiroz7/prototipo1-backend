import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cita')
export class CitaEntity {

  @PrimaryGeneratedColumn({ name: 'id_cita' })
  idCita: number;

  @Column({ name: 'id_cliente', type: 'int' })
  idCliente: number;

  @Column({ name: 'id_tratamiento', type: 'int' })
  idTratamiento: number;

  @Column({ name: 'nombre_tratamiento', type: 'varchar', length: 200 })
  nombreTratamiento: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ name: 'hora_inicio', type: 'time' })
  horaInicio: string;

  @Column({ name: 'hora_fin', type: 'time' })
  horaFin: string;

  @Column({
  type: 'varchar',
  length: 15,
  default: 'pendiente',
})

// 'pendiente', 'asistio', 'no_asistio'
estado: string;

  @Column({ default: false })
  eliminado: boolean;

  @Column({ name: 'fecha_creacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;
}


