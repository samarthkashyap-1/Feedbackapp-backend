import { body, param, validationResult } from "express-validator";
import ErrorHandler from "../utils/customError";

type Entity = "teacher" | "admin" | "feedback";

const getValidationRules = (entity: Entity) => {
	switch (entity) {
		case "teacher":
			return {
				create: [
					body("name").notEmpty().withMessage("Name is required"),
					body("email")
						.exists()
						.isEmail()
						.withMessage("Please provide a valid email address")
						.normalizeEmail(),
					body("password")
						.exists()
						.isLength({ min: 6 })
						.withMessage("Password must be at least 6 characters long"),
					body("phone").exists().withMessage("Phone number is required")
				],
				login: [
					body("email")
						.exists()
						.isEmail()
						.withMessage("Please provide a valid email address")
						.normalizeEmail(),
					body("password")
						.exists()
						.isLength({ min: 6 })
						.withMessage("Password must be at least 6 characters long")
				],
				getById: [param("id").exists().withMessage("Teacher id is required")],
				put: [param("id").exists().withMessage("Teacher id is required")],
				delete: [param("id").exists().withMessage("Teacher id is required")]
			};
		case "admin":
			return {
				create: [
					body("name").notEmpty().withMessage("Name is required"),
					body("email")
						.exists()
						.isEmail()
						.withMessage("Please provide a valid email address")
						.normalizeEmail(),
					body("password")
						.exists()
						.isLength({ min: 6 })
						.withMessage("Password must be at least 6 characters long")
				],
				login: [
					body("email")
						.exists()
						.isEmail()
						.withMessage("Please provide a valid email address")
						.normalizeEmail(),
					body("password")
						.exists()
						.isLength({ min: 6 })
						.withMessage("Password must be at least 6 characters long")
				],
				getById: [param("id").exists().withMessage("Admin id is required")],
				put: [param("id").exists().withMessage("Admin id is required")]
			};
		case "feedback":
			return {
				create: [
					body("student")
						.exists()
						.isString()
						.withMessage("No student provided"),
					body("feedback")
						.exists()
						.isString()
						.withMessage("Feedback is required"),
					body("subject")
						.exists()
						.isString()
						.withMessage("Subject is required"),
					body("createdAt").exists().withMessage("Creation Date is required"),
					body("duration").exists().withMessage("Duration is required"),
					body("testScore")
						.optional({ nullable: true })
						.isInt()
						.withMessage("Test score must be a number")
				],
				put: [param("id").exists().withMessage("Feedback id is required")],
				delete: [param("id").exists().withMessage("Feedback id is required")]
			};
		default:
			return {};
	}
};

const validate = (req, _res, next) => {
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		return next();
	}

	const extractedErrors = errors.array().map((err: any) => {
		return { path: err.path, message: err.msg };
	});
	return next(new ErrorHandler("Validation failed", 403, extractedErrors));
};

export { validate, getValidationRules };
