import { GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from "../Dtos/basic-prompt.dto";


export const basicPromptUseCase = async (ai : GoogleGenAI, basicPromptDto: BasicPromptDto) => {
     
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: basicPromptDto.prompt,
            config:{
                systemInstruction: `
                Responde únicamente en español, en formato Markdown y con un tono amigable. 
                Contesta solo preguntas relacionadas con odontología, salud bucal y temas dentales. 
                Si el usuario pregunta algo fuera de ese ámbito, responde de forma amable indicando el siguiente mensaje: 'Lo siento, pero solo puedo ayudar con temas relacionados con la clinica dental Perfect Teeth y temas relacionados a la salud bucal.(por ejemplo, consultas sobre la clínica o cuidados) 😊'
                Si el usuario te dice hola saluda como si fueras empleado de la clinica dental Perfect Teeth.
                adicional en el mensaje incluye el agendamiento de citas, consultar disponibildad de los especialistas, servicios que ofrece la clinica ademas de preguntar si tiene preguntas sobre alguna recomendacion de higiene bucal.
                `,
            }
        });
        return response.text;
    
}