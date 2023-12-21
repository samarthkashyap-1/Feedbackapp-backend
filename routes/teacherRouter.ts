import express from "express";
import {
	createTeacher,
	deleteTeacher,
	getAllTeachers,
	getTeacherById,
	teacherLogin,
	updateTeacherDetails
} from "../controllers/teacherController";
import { protect } from "../utils/auth";
import checkRole from "../middleware/checkRole";
import { getValidationRules, validate } from "../middleware/validator";
import { checkTeacherStatus } from "../middleware/checkTeacherStatus";

const teacherRouter = express.Router();

teacherRouter.get("/", [protect, checkRole("ADMIN")], getAllTeachers);

teacherRouter.get(
	"/:id",
	[
		protect,
		checkRole("ADMIN"),
		...getValidationRules("teacher").getById,
		validate
	],
	getTeacherById
);

teacherRouter.post(
	"/login",
	[...getValidationRules("teacher").login, validate, checkTeacherStatus],
	teacherLogin
);

teacherRouter.post(
	"/",
	[
		protect,
		checkRole("ADMIN"),
		...getValidationRules("teacher").create,
		validate
	],
	createTeacher
);

teacherRouter.put(
	"/:id",
	[protect, checkRole("ADMIN"), ...getValidationRules("teacher").put, validate],
	updateTeacherDetails
);

teacherRouter.delete(
	"/:id",
	[
		protect,
		checkRole("ADMIN"),
		...getValidationRules("teacher").delete,
		validate
	],
	deleteTeacher
);

export default teacherRouter;
