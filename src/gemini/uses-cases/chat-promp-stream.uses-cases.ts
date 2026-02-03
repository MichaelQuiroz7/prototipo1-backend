import { Content, createPartFromUri, GoogleGenAI } from "@google/genai";
import { ChatPromptDto } from "../Dtos/chat-prompt.dto";
import { geminiUploadFiles } from "../Dtos/helpers/gemini-upload-file";

interface Options {
  model?: string;
  systemInstruction?: string;
  history?: Content[];
  contextoClinico?: {
    tratamientos: any[];
    especialidades: any[];
    promociones: any[];
  };
}

export const chatPrompStreamUseCase = async (
  ai: GoogleGenAI,
  chatPromptDto: ChatPromptDto,
  options?: Options
) => {

  const { prompt, files = [] } = chatPromptDto;
  const uploadFiles = await geminiUploadFiles(ai, files);

  const {
    model = 'gemini-2.5-flash',
    history = [],
    contextoClinico,
  } = options ?? {};

  let contextoTexto = '';

  if (contextoClinico) {

    const tratamientosTexto = contextoClinico.tratamientos.map(t => `
- ID: ${t.IdTratamiento}
  Nombre: ${t.Nombre}
  Especialidad: ${t.Especialidad?.Nombre}
  Precio Base: ${t.Precio}
`).join('\n');

const promocionesTexto = contextoClinico.promociones.length > 0
  ? contextoClinico.promociones.map(p => `
- Tratamiento: ${p.nombreTratamiento}
  Especialidad: ${p.especialidad}
  Precio Base: ${p.precioBase}
  Precio Antes: ${p.precioAntes}
  Precio Ahora: ${p.precioAhora}
  2x1: ${p.es2x1 ? 'Sí' : 'No'}
`).join('\n')
  : 'No hay promociones activas';



    contextoTexto = `
===== CONTEXTO CLÍNICO REAL DE PERFECT TEETH =====

TRATAMIENTOS DISPONIBLES:
${tratamientosTexto}

PROMOCIONES ACTIVAS:
${promocionesTexto || 'No hay promociones activas'}

=================================================
`;
  }

  const systemInstruction = `
Eres asistente oficial de la clínica dental Perfect Teeth.

REGLAS OBLIGATORIAS:
- Responde SOLO temas relacionados con salud bucal o Perfect Teeth.
- Si preguntan algo fuera del ámbito dental responde:
  "Solo puedo ayudarte con temas relacionados con la clínica Perfect Teeth y salud bucal 😊"

- SIEMPRE:
  1) Identifica el tratamiento más adecuado según el malestar.
  2) Menciona la especialidad correspondiente.
  3) Indica el precio base del tratamiento.
  4) Si existe promoción activa para ese tratamiento, notifícalo claramente.
  5) Recomienda consulta general si es necesario.
  6) Máximo DOS párrafos cortos.
  7) No des respuestas genéricas.
`;

  const mensajeFinal = `
${contextoTexto}

CONSULTA DEL PACIENTE:
${prompt}

INSTRUCCIONES DE DECISIÓN:
- Analiza síntomas.
- Selecciona 1 tratamiento del listado.
- Cruza con promociones por idTratamiento.
- Si hay promoción indica precio antes y ahora.
- Si no hay promoción usa precio base.
- Siempre recomienda agendar cita.
`;


  const chat = ai.chats.create({
    model,
    config: { systemInstruction },
    history,
  });

  return chat.sendMessageStream({
    message: [{
      text: mensajeFinal,
      ...uploadFiles.map(file =>
        createPartFromUri(file.uri ?? '', file.mimeType ?? '')
      ),
    }]
  });
};































// import { Content, createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
// import fs from 'fs';
// import { ChatPromptDto } from "../Dtos/chat-prompt.dto";
// import { geminiUploadFiles } from "../Dtos/helpers/gemini-upload-file";

// // optional image conversion library
// let sharp: any = null;
// try { sharp = require('sharp'); } catch (err) { /* sharp optional */ }


// interface Options {
//   model?: string;
//   systemInstruction?: string;
//   history?: Content[];
// }


// export const chatPrompStreamUseCase = async (
//   ai: GoogleGenAI,
//   chatPromptDto: ChatPromptDto,
//   options?: Options
// ) => {
//   const { prompt, files = [] } = chatPromptDto;

//   const uploadFiles = await geminiUploadFiles(ai, files);

//   const {
//     model = 'gemini-2.5-flash',
//     history = [],
//     systemInstruction =
//     `
//       Responde únicamente en español, en formato Markdown y con un tono amigable. 
//       Contesta solo preguntas relacionadas con odontología, salud bucal y temas dentales. 
//       Si el usuario pregunta algo fuera de ese ámbito, responde de forma amable indicando el siguiente mensaje: 'Lo siento, pero solo puedo ayudar con temas relacionados con la clinica dental Perfect Teeth y temas relacionados a la salud bucal.(por ejemplo, consultas sobre la clínica o cuidados) 😊'
//       Si el usuario te dice hola saluda como si fueras empleado de la clinica dental Perfect Teeth.
//       adicional en el mensaje incluye el agendamiento de citas, consultar disponibildad de los especialistas, servicios que ofrece la clinica ademas de preguntar si tiene preguntas sobre alguna recomendacion de higiene bucal.
//       Si es imagen analizala y solo responde si es relacionado con odontologia y todo lo que abarca la clinica dental Perfect Teeth.
//       si es imgen da una descripcion de maximo un parrafo y sugiere si segun la radiogracia necesita operacion sugiere que programe una cita con un especialista en perfect teeth.
//       dame respuestas de maximo dos parrafos no tan largos
//     `
//   } = options ?? {};

//   const chat = ai.chats.create({
//     model: model,
//     config: {
//       systemInstruction: systemInstruction
//     },
//     history: history,
//   });

//   return chat.sendMessageStream({
//     message: [{
//       text: prompt,
//       ...uploadFiles.map((file) => createPartFromUri(
//         file.uri ?? ' ',
//         file.mimeType ?? ''
//       )),
//     }]
//   })

// }