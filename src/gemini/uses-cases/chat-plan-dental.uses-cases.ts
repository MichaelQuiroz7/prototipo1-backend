import { Content, createPartFromUri, GoogleGenAI } from "@google/genai";
import { ChatPromptDto } from "../Dtos/chat-prompt.dto";
import { geminiUploadFiles } from "../Dtos/helpers/gemini-upload-file";

let sharp: any = null;
try { sharp = require('sharp'); } catch (err) { /* sharp optional */ }

interface Options {
  model?: string;
  systemInstruction?: string;
  history?: Content[];
}

export const chatPlanDentalUsesCases = async (
  ai: GoogleGenAI,
  chatPromptDto: ChatPromptDto,
  options?: Options
) => {
  const { prompt, files = [] } = chatPromptDto;

  const uploadFiles = await geminiUploadFiles(ai, files);

  const {
    model = "gemini-2.5-flash",
    history = [],
    systemInstruction =
`Responde únicamente en español, con un tono profesional, breve y amable.

SIEMPRE debes responder con UNA SOLA LÍNEA DE TEXTO usando el siguiente formato EXACTO (sin saltos de línea, sin Markdown, sin texto adicional):

<HIGIENE_CORRECTA> | <RESUMEN_ESTADO_BUCAL> | <RIESGOS_CORTO_PLAZO> | <PRODUCTOS_RECOMENDADOS> | <NECESITA_CITA>

Donde:

1) <HIGIENE_CORRECTA>:
   - Escribe "SI" si el paciente tiene mala higiene bucal o necesita mejorar el cepillado (por ejemplo: caries, manchas, sarro, desgaste, inflamación, etc.).
   - Escribe "NO" si el odontograma muestra una dentadura en buen estado general.

2) <RESUMEN_ESTADO_BUCAL>:
   - Un solo párrafo corto describiendo el estado general de la boca (caries, manchas, encías, piezas tratadas, etc.).

3) <RIESGOS_CORTO_PLAZO>:
   - Un solo párrafo corto explicando qué podría pasar en el corto plazo si no se trata (dolor, infecciones, pérdida de piezas, sensibilidad, etc.).

4) <PRODUCTOS_RECOMENDADOS>:
   - De 1 a 3 productos.
   - Cada producto debe ir en texto plano y separado por punto y coma ";".
   - Formato recomendado para cada producto:
     "<CADENA>: <nombre del producto>, precio aproximado: <monto> USD, link: <url>"
   - Usa cadenas y farmacias de Ecuador como Fybeca, Sana Sana o Cruz Azul.
   - Los links pueden ser de ejemplo, pero deben tener forma de URL válida (https://...).

5) <NECESITA_CITA>:
   - Escribe "SI" si hay caries, desgaste, sarro, endodoncia, fractura, inflamación o cualquier hallazgo que requiera revisión profesional.
   - Escribe "NO" si todo está sano o solo hay hallazgos muy leves.

REGLAS IMPORTANTES:
- No uses tablas, ni Markdown, ni listas.
- No agregues texto antes ni después de la línea con los pipes "|".
- No hagas saltos de línea, toda la respuesta debe ser una sola línea.
- Si la entrada no está relacionada con odontología o salud bucal, igualmente RESPONDE usando el mismo formato, pero indicando en el resumen y riesgos que solo puedes ayudar con temas de Perfect Teeth y salud bucal.
- Si se envía una imagen, analízala solo si es odontológica (radiografía, foto de dientes, etc.) y genera la misma estructura de salida.
`
  } = options ?? {};

  const chat = ai.chats.create({
    model,
    config: { systemInstruction },
    history,
  });

  const response = await chat.sendMessage({
    message: [
      {
        text: prompt,
        ...uploadFiles.map((file) =>
          createPartFromUri(file.uri ?? " ", file.mimeType ?? "")
        ),
      },
    ],
  });

  // Texto completo en un solo envío (una sola línea con pipes)
  return response.text;
};





















































































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
