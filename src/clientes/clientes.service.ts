import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Cliente } from './dtoCliente/cliente_entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from './dtoCliente/rol_entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) { }

  // ============================================================
  //  CRUD CLIENTES
  // ============================================================

  // Crear cliente
  async create(data: Partial<Cliente>): Promise<Cliente> {
    let rol: Rol | null = null;

    // Si se envía un idRol, validamos que exista
    if (data.IdRol) {
      rol = await this.rolRepository.findOne({
        where: { IdRol: data.IdRol, Eliminado: false },
      });
      if (!rol) {
        throw new BadRequestException(
          `El rol con ID ${data.IdRol} no existe o está eliminado.`,
        );
      }
    }

    const nuevo = this.clienteRepository.create({
      ...data,
      Rol: rol ?? undefined,
    });

    return this.clienteRepository.save(nuevo);
  }

  // Obtener todos los clientes (solo no eliminados)
  async findAll(): Promise<Cliente[]> {
    return this.clienteRepository.find({
      where: { Eliminado: false },
      relations: ['Rol'],
      order: { IdCliente: 'ASC' },
    });
  }

  // Obtener cliente por ID
  async findById(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { IdCliente: id, Eliminado: false },
      relations: ['Rol'],
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return cliente;
  }

  // Actualizar cliente completo
  async update(id: number, data: Partial<Cliente>): Promise<Cliente> {
    const cliente = await this.findById(id);

    // Si intenta actualizar el rol, validamos que exista
    if (data.IdRol) {
      const rol = await this.rolRepository.findOne({
        where: { IdRol: data.IdRol, Eliminado: false },
      });
      if (!rol) {
        throw new BadRequestException(
          `El rol con ID ${data.IdRol} no existe o está eliminado.`,
        );
      }
      cliente.Rol = rol;
      cliente.IdRol = rol.IdRol;
    }

    Object.assign(cliente, data);
    return this.clienteRepository.save(cliente);
  }

  // Eliminar (lógico)
  async delete(id: number): Promise<void> {
    const cliente = await this.findById(id);
    cliente.Eliminado = true;
    await this.clienteRepository.save(cliente);
  }

  // Actualizar solo cédula
  async updateCedula(id: number, cedula: string): Promise<Cliente> {
    const cliente = await this.findById(id);
    cliente.Cedula = cedula;
    return this.clienteRepository.save(cliente);
  }

  async findByEmail(correo: string): Promise<Cliente | null> {
    return this.clienteRepository.findOne({ where: { Correo: correo } });
  }

   /**
   * Valida correo y contraseña 
   * Retorna el cliente si son correctos, o lanza excepción si no lo son
   */
  async loginLocal(correo: string, password: string): Promise<Cliente> {
    const cliente = await this.findByEmail(correo);

    if (!cliente) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    // Comparación directa de texto plano
    if (cliente.PasswordHash !== password) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }

    // Actualizar último acceso
    cliente.UltimoAcceso = new Date();
    await this.clienteRepository.save(cliente);

    // No retornar la contraseña
    //delete (cliente as any).PasswordHash;
    return cliente;
  }

  // ============================================================
  //  CRUD ROLES
  // ============================================================

  // Crear rol
  async createRol(data: Partial<Rol>): Promise<Rol> {
    const existente = await this.rolRepository.findOne({
      where: { Nombre: data.Nombre },
    });
    if (existente) {
      throw new BadRequestException(
        `Ya existe un rol con el nombre "${data.Nombre}"`,
      );
    }

    const nuevoRol = this.rolRepository.create(data);
    return this.rolRepository.save(nuevoRol);
  }

  // Obtener todos los roles (solo no eliminados)
  async findAllRoles(): Promise<Rol[]> {
    return this.rolRepository.find({
      where: { Eliminado: false },
      order: { IdRol: 'ASC' },
    });
  }

  // Obtener rol por ID
  async findRolById(id: number): Promise<Rol> {
    const rol = await this.rolRepository.findOne({
      where: { IdRol: id, Eliminado: false },
      relations: ['Clientes'],
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return rol;
  }

  // Actualizar rol
  async updateRol(id: number, data: Partial<Rol>): Promise<Rol> {
    const rol = await this.findRolById(id);
    Object.assign(rol, data);
    return this.rolRepository.save(rol);
  }

  // Eliminar rol (lógico)
  async deleteRol(id: number): Promise<void> {
    const rol = await this.findRolById(id);
    rol.Eliminado = true;
    await this.rolRepository.save(rol);
  }
}

