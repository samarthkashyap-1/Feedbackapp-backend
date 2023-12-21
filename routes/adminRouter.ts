import express from "express";
import {
	adminLogin,
	createAdmin,
	getAdminById,
	getAllAdmins,
	updateAdminDetails
} from "../controllers/adminController";
import checkRole from "../middleware/checkRole";
import { getValidationRules, validate } from "../middleware/validator";
import { protect } from "../utils/auth";

const adminRouter = express.Router();

adminRouter.get("/", [protect, checkRole("ADMIN")], getAllAdmins);

adminRouter.get(
	"/:id",
	[protect, checkRole("ADMIN"), ...getValidationRules("admin").getById, validate],
	getAdminById
);
adminRouter.post(
	"/",
	[protect, checkRole("ADMIN"), ...getValidationRules("admin").create, validate],
	createAdmin
);

adminRouter.put(
	"/:id",
	[protect, checkRole("ADMIN"), ...getValidationRules("admin").put],
	updateAdminDetails
);
adminRouter.post(
	"/login",
	[...getValidationRules("admin").login, validate],
	adminLogin
);

export default adminRouter;
