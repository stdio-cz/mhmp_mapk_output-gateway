const errorLog = require("debug")("data-platform:error");
const log = require("debug")("data-platform:output-gateway");

export class ErrorHandler {
    public handle = async (err: any) => {
        let toReturn: any;
        if (err.isOperational) {
            log(err);
            // Define what to return to user
            switch (err.status) {
                case 400: {
                    toReturn = {error_message: "Bad request", error_status: 400};
                    break;
                }
                case 404: {
                    toReturn = {error_message: "Not Found.", error_status: 404};
                    break;
                }
            }
        // Unexpected non-operational error, handle it!
        } else {
            errorLog(err);
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
