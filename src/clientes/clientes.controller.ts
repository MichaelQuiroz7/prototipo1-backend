import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { Cliente } from './dtoCliente/cliente_entity';
import { Rol } from './dtoCliente/rol_entity';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth/auth.service';
import { lastValueFrom } from 'rxjs';

@Controller('clientes')
export class ClientesController {
  constructor(
    private readonly clienteService: ClientesService,
    private readonly httpService: HttpService,
    private readonly authService: AuthService
  ) { }

  // ================================================================
  //  CLIENTES
  // ================================================================

  // Crear nuevo cliente
  @Post('AgregarCliente')
  async create(@Body() data: Partial<Cliente>): Promise<Cliente> {
    return this.clienteService.create(data);
  }

  // Obtener todos los clientes
  @Get('ObtenerClientes')
  async findAll(): Promise<Cliente[]> {
    return this.clienteService.findAll();
  }

  // Obtener cliente por ID
  @Get('ObtenerCliente/:id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Cliente> {
    return this.clienteService.findById(id);
  }

  // Actualizar cliente completo
  @Patch('ActualizarCliente/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Cliente>,
  ): Promise<Cliente> {
    return this.clienteService.update(id, data);
  }

  // Eliminar lógico
  @Delete('EliminarCliente/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.clienteService.delete(id);
  }

  // Actualizar solo cédula
  @Patch('ActualizarCedula/:id')
  async updateCedula(
    @Param('id', ParseIntPipe) id: number,
    @Body('cedula') cedula: string,
  ): Promise<Cliente> {
    return this.clienteService.updateCedula(id, cedula);
  }

  @Post('login')
  async loginLocal(
    @Body() body: { correo: string; password: string },
  ): Promise<Cliente> {
    const { correo, password } = body;

    if (!correo || !password) {
      throw new UnauthorizedException('Debe ingresar correo y contraseña.');
    }

    return this.clienteService.loginLocal(correo, password);
  }

  // ================================================================
  //  ROLES
  // ================================================================

  // Crear nuevo rol
  @Post('roles/AgregarRol')
  async createRol(@Body() data: Partial<Rol>): Promise<Rol> {
    return this.clienteService.createRol(data);
  }

  // Obtener todos los roles
  @Get('roles/ObtenerRoles')
  async findAllRoles(): Promise<Rol[]> {
    return this.clienteService.findAllRoles();
  }

  // Obtener rol por ID
  @Get('roles/ObtenerRol/:id')
  async findRolById(@Param('id', ParseIntPipe) id: number): Promise<Rol> {
    return this.clienteService.findRolById(id);
  }

  // Actualizar rol
  @Patch('roles/ActualizarRol/:id')
  async updateRol(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Rol>,
  ): Promise<Rol> {
    return this.clienteService.updateRol(id, data);
  }

  // Eliminar lógico de rol
  @Delete('roles/EliminarRol/:id')
  async deleteRol(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.clienteService.deleteRol(id);
  }

  @Post('auth/google')
  async loginWithGoogle(@Body() body) {
    const { token } = body;

    try {
      // Verificar token con Google usando lastValueFrom
      const response = await lastValueFrom(
        this.httpService.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
      );

      const data = response.data;

      //Registrar o loguear el usuario
      return this.authService.registerOrLoginGoogle(data);

    } catch (error) {
      console.error('Error al verificar token de Google:', error.message);
      throw new Error('Token de Google inválido o expirado.');
    }
  }


}