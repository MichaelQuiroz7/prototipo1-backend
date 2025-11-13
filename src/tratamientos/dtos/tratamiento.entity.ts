import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Especialidad } from "./especialidad.entity";

@Entity('tratamiento') 
export class Tratamiento {
  @PrimaryGeneratedColumn({ name: 'idtratamiento' })
  IdTratamiento: number;

  @Column({ name: 'codigo', length: 20, nullable: true })
  Codigo: string;

  @Column({ name: 'nombre', length: 200 })
  Nombre: string;

  @Column({ name: 'descripcion', length: 255, nullable: true })
  Descripcion: string;

  @Column({ name: 'precio', type: 'numeric', precision: 10, scale: 2, default: 0 })
  Precio: number;

  @Column({
    name: 'imagen',
    length: 255,
    nullable: true,
    default: '/assets/img/default-especialidad.png'
  })
  Imagen?: string;


  @Column({ name: 'idespecialidad' })
  IdEspecialidad: number;

  @Column({ name: 'eliminado', default: false })
  Eliminado: boolean;

  @CreateDateColumn({ name: 'fechacreacion' })
  FechaCreacion: Date;

  @ManyToOne(() => Especialidad, (especialidad) => especialidad.Tratamientos, { onUpdate: 'CASCADE', onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'idespecialidad' })
  Especialidad: Especialidad;
}
