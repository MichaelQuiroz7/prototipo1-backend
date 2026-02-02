import { Module } from '@nestjs/common';
import { ComentariosClientesService } from './comentarios-clientes.service';
import { ComentariosClientesController } from './comentarios-clientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComentarioCliente } from './dtoComentarios/comentario_entity';

@Module({
  imports: [TypeOrmModule.forFeature([ ComentarioCliente])],
  controllers: [ComentariosClientesController],
  providers: [ComentariosClientesService],
})
export class ComentariosClientesModule {}
