import { comparePassword, createJWT, hashPassword } from "../utils/auth";
import ErrorHandler from "../utils/customError";
import prisma from "../utils/db";

export const getAllAdmins = async (_req, res) => {
	const admins = await prisma.admin.findMany();
	return res.json({ success: true, data: admins });
};

export const getAdminById = async (req, res, next) => {
	const { id } = req.params;

	const admin = await prisma.admin.findUnique({
		where: {
			id
		}
	});

	if (!admin) {
		return next(new ErrorHandler("Admin not found", 404));
	}

	return res.json({ success: true, data: admin });
};

export const updateAdminDetails = async (req, res, next) => {
	const { id } = req.params;

	const admin = await prisma.admin.findUnique({
		where: {
			id
		}
	});

	if (!admin) {
		return next(new ErrorHandler("Admin not found", 404));
	}

	const updatedAdmin = await prisma.admin.update({
		where: {
			id
		},
		data: {
			...req.body
		}
	});

	return res.json({ success: true, data: updatedAdmin });
};

export const adminLogin = async (req, res, next) => {
	const { email, password } = req.body;

	const admin = await prisma.admin.findUnique({
		where: {
			email
		}
	});

	if (!admin) {
		return next(new ErrorHandler("Invalid credentials", 401));
	}

	const checkPassword = await comparePassword(password, admin.password);

	if (!checkPassword) {
		return next(new ErrorHandler("Invalid credentials", 401));
	}

	const userForToken = {
		id: admin.id,
		email: admin.email,
		role: admin.role
	};

	const token = createJWT(userForToken);

	return res.status(200).json({
		success: true,
		token
	});
};

export const createAdmin = async (req, res, next) => {
	const admin = await prisma.admin.findUnique({
		where: {
			email: req.body.email
		}
	});

	if (admin) {
		return next(
			new ErrorHandler("Admin with provided mail already exists", 400)
		);
	}

	const hashedPassword = await hashPassword(req.body.password);

	await prisma.admin.create({
		data: {
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword
		}
	});

	return res.status(201).json({
		success: true,
		message: "Admin created successfully"
	});
};
