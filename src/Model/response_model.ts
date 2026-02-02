import { ResponseType } from "./response_type";


export class ResponseModel {
  code: ResponseType;
  message: string;
  data?: object;

  constructor(
    code: ResponseType,
    message: string,
    data?: object,
  ) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}