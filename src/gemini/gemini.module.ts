import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { ChatContextService } from './ChatContextService';
import { TratamientosService } from 'src/tratamientos/tratamientos.service';
import { PromocionesService } from 'src/promociones/promociones.service';
import { PromocionesModule } from 'src/promociones/promociones.module';
import { TratamientosModule } from 'src/tratamientos/tratamientos.module';

@Module({
  imports: [TratamientosModule, PromocionesModule],
  controllers: [GeminiController],
  providers: [GeminiService, ChatContextService
  ]
  
})
export class GeminiModule { }
