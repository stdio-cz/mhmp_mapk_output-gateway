/**
 * Custom error class, encapsulating a default node Error object,
 * decorating it for extra functionality
 */
export class CustomError extends Error {
    /** Error description */
    public name: string;
    /**
     * Defines if the error is operational (runtime expected application error)
     * or not (unknown/fatal error, app should gracefully die on this type of error).
     */
    public isOperational?: boolean;
    /** Error code for better identifing type of error */
    public code?: number;
    /** Additional info about error cause, parent error */
    public cause?: any;

    /**
     * Create a new Error object
     *
     * @param message Error message
     * @param {boolean} isOperational If the error is operational (runtime expected application error)
     * or not (unknown/fatal error, app should gracefully die on this).
     * @param code Error code
     * @param cause Cause of the error - parent error, parent context or similar
     */
    constructor(message: string, isOperational?: boolean, code?: number, cause?: any) {
        super(message);
        this.name = (this.constructor as any).name;
        this.message = message;
        this.isOperational = isOperational;
        this.code = code;
        this.cause = cause;
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Converts the error to string
     */
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
