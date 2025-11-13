import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './dtoCliente/cliente_entity';
import { Rol } from './dtoCliente/rol_entity';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [ TypeOrmModule.forFeature([Cliente, Rol]),HttpModule ],
  controllers: [ClientesController],
  providers: [ClientesService, AuthService],
})
export class ClientesModule {}
