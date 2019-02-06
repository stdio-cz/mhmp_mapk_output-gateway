import log from "../Logger";

export class ErrorHandler {
    public handle = async (err: any) => {
        let toReturn: any;
        // Many operational errors, handle it!
        if (err.isOperational) {
            log.error(err.toString());
            // Define what to return to user
            switch (err.code) {
                case 400: {
                    toReturn = {error_message: "Bad request", error_status: 400};
                    break;
                }
                case 404: {
                    toReturn = {error_message: "Not Found.", error_status: 404};
                    break;
                }
                case 409: {
                    toReturn = {error_message: "Conflict.", error_status: 404};
                    break;
                }
                default: {
                    toReturn = {error_message: "Server error.", error_status: 500};
                }
            }
        } else { // Unexpected non-operational error, damn u ded
            log.error("Fatal error: " + err);
            process.exit(0); // if anything fails, process is killed
        }
        // If we're in development, add stack trace to the error object
        if (process.env.NODE_ENV === "development") {
            toReturn.stack_trace = err.stack;
        }
        return toReturn;
    }
}

export default new ErrorHandler().handle;
