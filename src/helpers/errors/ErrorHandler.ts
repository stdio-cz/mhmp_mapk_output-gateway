const errorLog = require("debug")("data-platform:error");
const log = require("debug")("data-platform:output-gateway");

export class ErrorHandler {
    public handle = async (err: any) => {
        let toReturn: any;
        // Many operational errors, handle it!
        if (err.isOperational) {
            log(err.toString());
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
                default: {
                    toReturn = {error_message: "Server error.", error_status: 500};
                }
            }
        } else { // Unexpected non-operational error, dam u ded
            errorLog("Fatal error: " + err);
            process.exit(0); // if anything fails, process is killed
        }
        // If we're in development, send Error stack also in a response
        if (process.env.NODE_ENV === "development") {
            toReturn.stack_trace = err.stack;
        }
        return toReturn;
    }
}

export default new ErrorHandler().handle;
