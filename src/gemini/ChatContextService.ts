import { Injectable } from "@nestjs/common";
import { PromocionesService } from "src/promociones/promociones.service";
import { TratamientosService } from "src/tratamientos/tratamientos.service";

@Injectable()
export class ChatContextService {

  constructor(
    private readonly tratamientosService: TratamientosService,
    private readonly promocionesService: PromocionesService,
  ) {}

  async obtenerContextoClinico() {

    // Obtener tratamientos y especialidades
    const tratamientos = await this.tratamientosService.findAllTratamiento();
    const especialidades = await this.tratamientosService.findAllEspecialidades();

    // Obtener promociones
    const promocionesResponse = await this.promocionesService.obtenerPromociones();

    const promocionesRaw = Array.isArray(promocionesResponse.data)
      ? promocionesResponse.data
      : [];

    const hoy = new Date();

    // 🔥 Filtrar promociones activas usando los nombres reales del JSON
    const promocionesActivas = promocionesRaw.filter((p: any) =>
      new Date(p.fecha_inicio) <= hoy &&
      new Date(p.fecha_fin) >= hoy &&
      p.eliminado === false
    );

    // 🔥 Enriquecer promociones cruzando con tratamientos
    const promocionesEnriquecidas = promocionesActivas.map((promo: any) => {

      const tratamiento = tratamientos.find(
        t => t.IdTratamiento === promo.id_tratamiento
      );

      return {
        idTratamiento: promo.id_tratamiento,
        nombreTratamiento: tratamiento?.Nombre ?? 'Desconocido',
        especialidad: tratamiento?.Especialidad?.Nombre ?? 'Desconocida',
        precioBase: tratamiento?.Precio ?? 0,
        precioAntes: promo.precio_antes,
        precioAhora: promo.precio_ahora,
        es2x1: promo.es_2x1,
      };
    });

    // 🔎 LOG PARA DEPURAR
    console.log("========== CONTEXTO CLÍNICO ENVIADO ==========");
    console.log("Tratamientos:", tratamientos.length);
    console.log("Promociones Activas:", promocionesEnriquecidas);
    console.log("=============================================");

    return {
      tratamientos,
      especialidades,
      promociones: promocionesEnriquecidas,
    };
  }
}
