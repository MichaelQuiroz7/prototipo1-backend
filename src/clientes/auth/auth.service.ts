

import { Injectable } from '@nestjs/common';
import { ClientesService } from '../clientes.service';
import { Cliente } from '../dtoCliente/cliente_entity';


@Injectable()
export class AuthService {
  constructor(private readonly clientesService: ClientesService) {}

  async registerOrLoginGoogle(data: any): Promise<Cliente> {
    const { email, name, picture, sub } = data;

    const existing = await this.clientesService.findByEmail(email);
    if (existing) return existing;

    return await this.clientesService.create({
      Nombre: name?.split(' ')[0] ?? '',
      Apellido: name?.split(' ').slice(1).join(' ') ?? '',
      Correo: email,
      GoogleId: sub,
      FotoPerfil: picture,
      ProveedorAuth: 'google',
      IdRol: 1,
      FechaRegistro: new Date(),
    });
  }
}
