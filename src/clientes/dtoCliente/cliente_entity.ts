import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import { Rol } from './rol_entity';

@Entity('cliente')
export class Cliente {
  @PrimaryGeneratedColumn({ name: 'id_cliente' })
  IdCliente: number;

  @Column({ name: 'nombre', length: 100 })
  Nombre: string;

  @Column({ name: 'apellido', length: 100, nullable: true })
  Apellido?: string;

  @Column({ name: 'cedula', length: 20, nullable: true })
  Cedula?: string;

  @Column({ name: 'correo', length: 150, unique: true })
  Correo: string;

  @Column({ name: 'telefono', length: 20, nullable: true })
  Telefono?: string;

  @Column({ name: 'foto_perfil', length: 255, nullable: true })
  FotoPerfil?: string;

  @Column({ name: 'google_id', length: 100, nullable: true })
  GoogleId?: string;

  @Column({ name: 'password_hash', length: 255, nullable: true })
  PasswordHash?: string;

  @Column({
    name: 'proveedor_auth',
    type: 'varchar',
    length: 20,
    default: 'local',
  })
  ProveedorAuth: 'local' | 'google';

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  FechaNacimiento?: Date;

  @Column({ name: 'genero', length: 20, nullable: true })
  Genero?: string;

  // 🔹 Relación con ROL
  @Column({ name: 'id_rol', nullable: true })
  IdRol?: number;

  @ManyToOne(() => Rol, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_rol' })
  Rol?: Rol;

  // 🔹 Campos de auditoría
  @CreateDateColumn({ name: 'fecha_registro' })
  FechaRegistro: Date;

  @UpdateDateColumn({ name: 'ultimo_acceso', nullable: true })
  UltimoAcceso?: Date;

  // 🔹 Estado del cliente
  @Column({ name: 'activo', default: true })
  Activo: boolean;

  // 🔹 Eliminación lógica
  @Column({ name: 'eliminado', default: false })
  Eliminado: boolean;
}
