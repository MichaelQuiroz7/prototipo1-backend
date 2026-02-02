import { Module } from '@nestjs/common';
import { PromocionesService } from './promociones.service';
import { PromocionesController } from './promociones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePromocionDto, Promocion, UpdatePromocionDto } from './dto/promocion_entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ TypeOrmModule.forFeature([Promocion, UpdatePromocionDto, CreatePromocionDto]),HttpModule ],
  controllers: [PromocionesController],
  providers: [PromocionesService],
})
export class PromocionesModule {}
