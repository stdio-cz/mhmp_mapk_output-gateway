
import { CustomError, ICustomErrorObject } from ".";
import { log } from "../Logger";

/**
 * Class responsible for error handling in the app. Catches errors and based on their type performs some action
 */
export class ErrorHandler {
    /**
     * Handle an error
     * @param err Error object to catch
     */
    public handle = async (err: Error | CustomError) => {
        let toReturn: ICustomErrorObject;
        // Many operational errors, handle it!
        if (err instanceof CustomError && err.isOperational) {
            log.error(err.toString());
            // Define what to return to user
            switch (err.code) {
                case 400: {
                    toReturn = {
                        error_message: "Bad request",
                        error_status: 400,
                        ...(err.cause && { cause: err.cause }),
                    };
                    break;
                }
                case 404: {
                    toReturn = { error_message: "Not Found.", error_status: 404 };
                    break;
                }
                case 409: {
                    toReturn = { error_message: "Conflict.", error_status: 409 };
                    break;
                }
                default: {
                    toReturn = { error_message: "Server error.", error_status: 500 };
                }
            }
            // Error in wrong format (err.isOperational is undefined) also falls here
        } else { // Unexpected non-operational error, damn u ded
            log.error("Fatal error: " + err);
            log.silly("Calling process.exit");
            return process.exit((err as any).code); // if anything fails, process is killed
        }
        // If we're in development, add stack trace to the error object
        if (process.env.NODE_ENV === "development") {
            toReturn.stack_trace = err.stack;
        }
        return toReturn;
    }
}

const handleError: (err: Error | CustomError) => Promise<ICustomErrorObject> = new ErrorHandler().handle;

export { handleError };
