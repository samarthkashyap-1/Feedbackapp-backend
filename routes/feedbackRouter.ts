import express from "express";
import {
	createFeedback,
	deleteFeedback,
	getAllFeedbacks,
	getFeedbackById,
	getFeedbackByTeacherId,
	updateFeedback
} from "../controllers/feedbackController";
import { protect } from "../utils/auth";
import { getValidationRules, validate } from "../middleware/validator";
import checkRole from "../middleware/checkRole";
import { checkTeacherStatus } from "../middleware/checkTeacherStatus";

const feedbackRouter = express.Router();

feedbackRouter.get("/", [protect, checkRole("ADMIN")], getAllFeedbacks);

feedbackRouter.get("/:id", [protect, checkTeacherStatus], getFeedbackById);
feedbackRouter.get("/:teacherId", [protect, checkTeacherStatus], getFeedbackByTeacherId);

feedbackRouter.post(
	"/",
	[protect, checkTeacherStatus, ...getValidationRules("feedback").create, validate],
	createFeedback
);

feedbackRouter.put(
	"/:id",
	[protect, checkRole("ADMIN"), ...getValidationRules("feedback").put, validate],
	updateFeedback
);

feedbackRouter.delete(
	"/:id",
	[
		protect,
		checkRole("ADMIN"),
		...getValidationRules("feedback").delete,
		validate
	],
	deleteFeedback
);

export default feedbackRouter;
