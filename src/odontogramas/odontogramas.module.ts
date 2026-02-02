import { Module } from '@nestjs/common';
import { OdontogramasService } from './odontogramas.service';
import { OdontogramasController } from './odontogramas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OdontoColor } from './dto/odontocolor_entity';
import { CatalogoDientes } from './dto/catalogo_dientes_entity';
import { Odontograma } from './dto/odontograma_entity';
import { OdontogramaDetalle } from './dto/odontograma_detalle';

@Module({
  imports: [
    TypeOrmModule.forFeature([ OdontoColor, CatalogoDientes, Odontograma, OdontogramaDetalle, ]),
  ],
  controllers: [OdontogramasController],
  providers: [OdontogramasService],
})
export class OdontogramasModule {}
