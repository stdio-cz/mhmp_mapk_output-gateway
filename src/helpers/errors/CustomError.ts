export default class CustomError extends Error {
  public name: string;
  public isOperational?: boolean;
  public status?: number;

  constructor(message: string, isOperational?: boolean, status?: number) {
    super(message);
    this.name = (this.constructor as any).name;
    this.message = message;
    this.isOperational = isOperational;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}
