import { ValidationError } from "express-validator";
import ErrorHandler from "../utils/customError";

const errorHandler = (err, _req, res, _next) => {
	// Check if it's a validation error
	if (err.validationErrors) {
		return res.status(err.statusCode).json({
			success: false,
			message: err.message,
			errors: err.validationErrors
		});
	}

	// Handle other types of errors
	err.message = err.message || "Internal Server Error";
	err.statusCode = err.statusCode || 500;

	res.status(err.statusCode).json({
		success: false,
		message: err.message
	});
};

export default errorHandler;
