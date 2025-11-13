import { Module } from '@nestjs/common';
import { TratamientosService } from './tratamientos.service';
import { TratamientosController } from './tratamientos.controller';
import { Tratamiento } from './dtos/tratamiento.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especialidad } from './dtos/especialidad.entity';

@Module({

  imports: [TypeOrmModule.forFeature([Tratamiento, Especialidad])],
  controllers: [TratamientosController],
  providers: [TratamientosService],
  
})
  export class TratamientosModule { }
