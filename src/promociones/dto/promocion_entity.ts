import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsOptional } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('promocion')
export class Promocion {

  @PrimaryGeneratedColumn({ name: 'id_promocion' })
  idPromocion: number;

  @Column({ name: 'id_tratamiento' })
  idTratamiento: number;

  @Column({ name: 'precio_antes', type: 'numeric' })
  precioAntes: number;

  @Column({ name: 'precio_ahora', type: 'numeric' })
  precioAhora: number;

  @Column({ name: 'es_2x1', default: false })
  es2x1: boolean;

  @Column({ name: 'fecha_inicio', type: 'timestamp' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'timestamp' })
  fechaFin: Date;

  @Column({ name: 'limite', nullable: true })
  limite: number;

  @Column({ name: 'eliminado', default: false })
  eliminado: boolean;

  @Column({ name: 'fecha_creacion', type: 'timestamp' })
  fechaCreacion: Date;
}


export class CreatePromocionDto {

  @IsNumber()
  idTratamiento: number;

  @IsNumber()
  precioAntes: number;

  @IsNumber()
  precioAhora: number;

  @IsBoolean()
  es2x1: boolean;

  @IsDate()
  @Type(() => Date)
  fechaInicio: Date;

  @IsDate()
  @Type(() => Date)
  fechaFin: Date;

  @IsOptional()
  @IsNumber()
  limite?: number;
}



export class UpdatePromocionDto {

  @IsNumber()
  idPromocion: number;

  @IsNumber()
  precioAntes: number;

  @IsNumber()
  precioAhora: number;

  @IsBoolean()
  es2x1: boolean;

  @IsDate()
  @Type(() => Date)
  fechaInicio: Date;

  @IsDate()
  @Type(() => Date)
  fechaFin: Date;

  @IsOptional()
  @IsNumber()
  limite?: number;
}


