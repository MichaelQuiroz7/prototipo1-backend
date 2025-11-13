import { Body, Controller, Post, Res, HttpStatus, UseInterceptors, UploadedFiles, Param, Get } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { BasicPromptDto } from './Dtos/basic-prompt.dto';
import express from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BasicPromptImagenDto } from './Dtos/basic-prompt-Imagen.dto';
import { ChatPromptDto } from './Dtos/chat-prompt.dto';
import { GenerateContentResponse } from '@google/genai';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) { }


  async outputStreamResponse(
    res: express.Response,
    stream: AsyncGenerator<GenerateContentResponse, any, any>
  ) {

    //res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(HttpStatus.OK);

    let resultText = '';
    for await (const part of stream) {
      const piece = part.text;
      resultText += piece;
      res.write(piece);
    }
    res.end();
    return resultText;

  }


  @Post('basic-prompt')
  async basicPrompt(@Body() basicPromptDto: BasicPromptDto) {
    return this.geminiService.basicPrompt(basicPromptDto);
  }

  @Post('basic-prompt-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async basicPromptStream(
    @Body() basicPromptImagenDto: BasicPromptImagenDto,
    @Res() res: express.Response,
    @UploadedFiles() files: Array<Express.Multer.File>,

  ) {
    basicPromptImagenDto.files = files;
    const response = await this.geminiService.basicPromptStream(basicPromptImagenDto);
    res.setHeader('Content-Type', 'application/json');
    //res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(HttpStatus.OK);

    for await (const part of response) {
      const piece = part.text;
      console.log(piece);
      res.write(piece);
    }
    res.end();

  }
  // @Get()
  // getHelloworld() {

  //   const apikey= process.env.GEMINI_API_KEY;
  //   return 'api key: ' + apikey;
  // }



  @Post('chat-stream')
  @UseInterceptors(FilesInterceptor('files'))
  async chatStream(
    @Body() chatPromptDto: ChatPromptDto,
    @Res() res: express.Response,
    @UploadedFiles() files: Array<Express.Multer.File>,

  ) {

    chatPromptDto.files = files;

    const stream = await this.geminiService.chatStream(chatPromptDto);

    const data = await this.outputStreamResponse(res, stream);

    const geminiMessage = {
      role: 'model',
      parts: [{ text: data }],
    };

    const userMessage = {
      role: 'user',
      parts: [{ text: chatPromptDto.prompt }],
    };

    this.geminiService.saveMessage(chatPromptDto.chatId ?? 'default', userMessage);
    this.geminiService.saveMessage(chatPromptDto.chatId ?? 'default', geminiMessage);

    return data;

  }



  @Get('chat-history/:chatId')
  getChatHistory(@Param('chatId') chatId: string) {
    return this.geminiService.getChatHsitory(chatId).map(message => ({
      role: message.role,
      message: message.parts?.map(part => part.text).join(''),
    }));
  }









}
