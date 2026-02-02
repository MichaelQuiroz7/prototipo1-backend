import { IsDateString, IsInt, IsNumber, IsString } from "class-validator";

export class CreateCitaDto {
  @IsInt()
  idCliente: number;

  @IsInt()
  idTratamiento: number;

  @IsString()
  nombreTratamiento: string;

  @IsNumber()
  precio: number;

  @IsDateString()
  fecha: string;

  @IsString()
  horaInicio: string;

  @IsString()
  horaFin: string;

  @IsString()
  estado: string;
}