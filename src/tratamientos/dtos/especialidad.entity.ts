import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tratamiento } from "./tratamiento.entity";

@Entity('especialidad') 
export class Especialidad {
  @PrimaryGeneratedColumn({ name: 'idespecialidad' })
  IdEspecialidad: number;

  @Column({ name: 'nombre', length: 100 })
  Nombre: string;

  @Column({ name: 'descripcion', length: 255, nullable: true })
  Descripcion: string;

  @Column({
    name: 'imagen',
    length: 255,
    nullable: true,
    default: '/assets/img/default-especialidad.png'
  })
  Imagen?: string;


  @Column({ name: 'eliminado', default: false })
  Eliminado: boolean;

  @CreateDateColumn({ name: 'fechacreacion' })
  FechaCreacion: Date;

  @OneToMany(() => Tratamiento, (tratamiento) => tratamiento.Especialidad)
  Tratamientos: Tratamiento[];
}
