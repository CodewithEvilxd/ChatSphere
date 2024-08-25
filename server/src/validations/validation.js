import { ZodError } from "zod";
import { errorHandler } from "../utils/error.js";

const validate = (schema, data) => {
    try {
        schema.parse(data); 
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.errors.map((err) => err.message).join(" & ");
            throw errorHandler(400, errorMessages); // Throw the error to be caught in the controller
        }
        throw error; // For other types of errors
    }
};

export { validate };
