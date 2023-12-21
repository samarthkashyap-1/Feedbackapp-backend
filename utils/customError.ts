class ErrorHandler extends Error {
	statusCode: number;
	validationErrors?: any[]; // Add this property for validation errors

	constructor(message: string, statusCode: number, validationErrors?: any[]) {
		super(message);
		this.statusCode = statusCode;
		this.validationErrors = validationErrors;
		Error.captureStackTrace(this, this.constructor);
	}
}

export default ErrorHandler;
