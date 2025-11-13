import { Content, createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import fs from 'fs';
import { ChatPromptDto } from "../Dtos/chat-prompt.dto";
import { geminiUploadFiles } from "../Dtos/helpers/gemini-upload-file";

// optional image conversion library
let sharp: any = null;
try { sharp = require('sharp'); } catch (err) { /* sharp optional */ }


interface Options {
  model?: string;
  systemInstruction?: string;
  history?: Content[];
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
    systemInstruction =
    `
      Responde únicamente en español, en formato Markdown y con un tono amigable. 
      Contesta solo preguntas relacionadas con odontología, salud bucal y temas dentales. 
      Si el usuario pregunta algo fuera de ese ámbito, responde de forma amable indicando el siguiente mensaje: 'Lo siento, pero solo puedo ayudar con temas relacionados con la clinica dental Perfect Teeth y temas relacionados a la salud bucal.(por ejemplo, consultas sobre la clínica o cuidados) 😊'
      Si el usuario te dice hola saluda como si fueras empleado de la clinica dental Perfect Teeth.
      adicional en el mensaje incluye el agendamiento de citas, consultar disponibildad de los especialistas, servicios que ofrece la clinica ademas de preguntar si tiene preguntas sobre alguna recomendacion de higiene bucal.
      Si es imagen analizala y solo responde si es relacionado con odontologia y todo lo que abarca la clinica dental Perfect Teeth.
      si es imgen da una descripcion de maximo un parrafo y sugiere si segun la radiogracia necesita operacion sugiere que programe una cita con un especialista en perfect teeth.
      dame respuestas de maximo dos parrafos no tan largos
    `
  } = options ?? {};

  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: systemInstruction
    },
    history: history,
  });

  return chat.sendMessageStream({
    message: [{
      text: prompt,
      ...uploadFiles.map((file) => createPartFromUri(
        file.uri ?? ' ',
        file.mimeType ?? ''
      )),
    }]
  })

}




















































































// Handle different image formats and storage types (memory/disk)
//const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff', 'image/heic'];


// const uploadFiles = await Promise.all(files.map(async (file) => {
//         const mime = file.mimetype || 'image/jpeg';

//         // helper to upload a Buffer as a Blob (Uint8Array)
//         const uploadBuffer = async (buffer: Buffer, mimeType: string) => {
//             const part = new Blob([Uint8Array.from(buffer)], { type: mimeType });
//             return ai.files.upload({ file: part });
//         };

//         // If Multer stored buffer in memory
//         if (file.buffer) {
//             // If mime is known and allowed, upload directly
//             if (mime.includes('image') && allowedImageTypes.includes(mime)) {
//                 return uploadBuffer(file.buffer, mime);
//             }

//             // If sharp is available, try converting to jpeg
//             if (sharp) {
//                 try {
//                     const converted = await sharp(file.buffer).jpeg().toBuffer();
//                     return uploadBuffer(converted, 'image/jpeg');
//                 } catch (e) {
//                     // fallback to raw buffer as jpeg
//                     return uploadBuffer(file.buffer, 'image/jpeg');
//                 }
//             }

//             // fallback: upload raw buffer as jpeg
//             return uploadBuffer(file.buffer, 'image/jpeg');
//         }

//         // If Multer saved the file to disk, read it and upload
//         if ((file as any).path) {
//             const diskBuffer = fs.readFileSync((file as any).path);
//             // try to upload with detected mime, else convert if sharp
//             if (mime.includes('image') && allowedImageTypes.includes(mime)) {
//                 return uploadBuffer(diskBuffer, mime);
//             }
//             if (sharp) {
//                 try {
//                     const converted = await sharp(diskBuffer).jpeg().toBuffer();
//                     return uploadBuffer(converted, 'image/jpeg');
//                 } catch (e) {
//                     return uploadBuffer(diskBuffer, 'image/jpeg');
//                 }
//             }
//             return uploadBuffer(diskBuffer, 'image/jpeg');
//         }

//         // final fallback: empty blob
//         return ai.files.upload({ file: new Blob([], { type: mime }) });
//     }));
