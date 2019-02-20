"use strict";

export default class CustomError extends Error {
    /** Error description */
    public name: string;
    /** Defines that error is operational */
    public isOperational?: boolean;
    /** Error code for better identifing type of error */
    public code?: number;
    /** Additional info about error cause, parent error */
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

  /**
   * Returns complete error description as object.
   */
  public toObject = (): {error_code: number, error_message: string, error_info: any} => {
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
