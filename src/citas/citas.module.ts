import { Module } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitaEntity } from './dto/cita.dto';

@Module({
  imports: [TypeOrmModule.forFeature([ CitaEntity])],
  controllers: [CitasController],
  providers: [CitasService],
})
export class CitasModule {}
