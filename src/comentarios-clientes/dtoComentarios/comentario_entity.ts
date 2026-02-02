import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('comentario_cliente')
export class ComentarioCliente {

    @PrimaryColumn({ name: 'id_comentario', type: 'int' })
    idComentario: number;

    @Column({ type: 'varchar' })
    image: string;

    @Column({ type: 'varchar' })
    nombre: string;

    @Column({ type: 'varchar' })
    tratamiento: string;

    @Column({ type: 'numeric' })
    puntuacion: number;

    @Column({ type: 'text' })
    feedback: string;

    @Column({ type: 'boolean' })
    eliminado: boolean;

    @Column({ type: 'timestamp' })
    fecha: Date;
}


export class CreateComentarioDto {
  @IsInt()
  idCliente: number;

  @IsNumber({ maxDecimalPlaces: 1 })
  puntuacion: number;

  @IsString()
  @IsNotEmpty()
  feedback: string;
}