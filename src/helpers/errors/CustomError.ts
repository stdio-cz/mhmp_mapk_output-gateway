"use strict";

export default class CustomError extends Error {
  public name: string;
  public isOperational?: boolean;
  public code?: number;
  public cause?: any;

  constructor(message: string, isOperational?: boolean, code?: number, cause?: any) {
    super(message);
    this.name = (this.constructor as any).name;
    this.message = message;
    this.isOperational = isOperational;
    this.code = code;
    this.cause = cause;
    Error.captureStackTrace(this, this.constructor);
  }

  public toString = (): string => {
    return ((this.code) ? "[" + this.code + "] " : "")
        + this.message
        + ((this.cause) ? " (" + this.cause + ")" : "")
        + ((process.env.NODE_ENV === "development") ? "\n" + this.stack : "");
  }

  public toObject = (): object => {
      const toReturn: any = {
          error_message: this.message,
      };
      if (this.code) {
          toReturn.error_code = this.code;
      }
      if (this.cause) {
          toReturn.error_info = this.cause;
      }
      if (process.env.NODE_ENV === "development") {
          toReturn.stack_trace = this.stack;
      }
      return toReturn;
  }

}
