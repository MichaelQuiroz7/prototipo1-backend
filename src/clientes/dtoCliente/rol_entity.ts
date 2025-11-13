import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from './cliente_entity';


@Entity('rol')
export class Rol {
  @PrimaryGeneratedColumn({ name: 'id_rol' })
  IdRol: number;

  @Column({ name: 'nombre', length: 50, unique: true })
  Nombre: string;

  @Column({ name: 'descripcion', length: 255, nullable: true })
  Descripcion?: string;

  @Column({ name: 'eliminado', default: false })
  Eliminado: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  FechaCreacion: Date;

  @OneToMany(() => Cliente, (cliente) => cliente.Rol)
  Clientes: Cliente[];
}

