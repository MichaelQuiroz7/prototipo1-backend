import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './Dtos/basic-prompt.dto';
import { Content, GoogleGenAI } from '@google/genai';
import { basicPromptUseCase } from './uses-cases/promp.uses-cases';
import { basicPromptStreamUseCase } from './uses-cases/promp-stream.uses-cases';
import { BasicPromptImagenDto } from './Dtos/basic-prompt-Imagen.dto';
import { ChatPromptDto } from './Dtos/chat-prompt.dto';
import { chatPrompStreamUseCase } from './uses-cases/chat-promp-stream.uses-cases';

@Injectable()
export class GeminiService {

   private ai: any;

   constructor() {
      try {
         // Lazy init to capture possible errors and log them
         this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      } catch (err) {
         console.error('GeminiService: error initializing GoogleGenAI', err && (err.stack || err));
         this.ai = undefined;
      }
   }



   private chatHistory = new Map<String, Content[] >();


   async basicPrompt(basicPromptDto: BasicPromptDto) {
      return await basicPromptUseCase(this.ai, basicPromptDto);
   }

   async basicPromptStream(basicPromptDto: BasicPromptImagenDto) {
      return basicPromptStreamUseCase(this.ai, basicPromptDto);
   }

   async chatStream(chatPromptDto: ChatPromptDto) {
      const chatHistory = this.getChatHsitory(chatPromptDto.chatId ?? 'default');
      return chatPrompStreamUseCase(this.ai, chatPromptDto, { history: chatHistory });
   }


   saveMessage(chatId: String, message: Content){
      const messages = this.getChatHsitory(chatId);
      messages.push(message);
      this.chatHistory.set(chatId, messages);
   }

   getChatHsitory(chatId: String){
      return structuredClone( this.chatHistory.get(chatId) ?? [] );
   }



}
