import ErrorHandler from "../utils/customError";
import prisma from "../utils/db";

export const getAllFeedbacks = async (_req, res) => {
	const feedbacks = await prisma.feedback.findMany();
	res.json({ success: true, data: feedbacks });
};

export const getFeedbackByTeacherId = async (req, res, next) => {
	const { teacherId } = req.params;

	const teacher = await prisma.teacher.findUnique({
		where: {
			id: teacherId
		},
		include: {
			feedbacks: true
		}
	});

	if (!teacher) {
		return next(new ErrorHandler("Invalid teacher id provided", 404));
	}

	const feedbacks = teacher.feedbacks;
	return res.status(201).json({ success: true, data: feedbacks });
};

export const getFeedbackById = async (req, res, next) => {
	const { id } = req.params;

	const feedback = await prisma.feedback.findUnique({
		where: {
			id
		}
	});

	if (!feedback) {
		return next(new ErrorHandler("Invalid feedback id", 404));
	}

	return res.status(200).json({ success: true, data: feedback });
};

export const createFeedback = async (req, res, next) => {
	const { student, feedback, testScore, subject, duration, createdAt, topic } =
		req.body;

	const weekDayInString = new Date(req.body.createdAt).toLocaleString("en-US", {
		weekday: "long"
	});

	const monthInString = new Date(req.body.createdAt).toLocaleString("en-US", {
		month: "long"
	});

	const teacher = await prisma.teacher.findUnique({
		where: {
			id: req.user.id
		}
	});

	if (!teacher) {
		return next(new ErrorHandler("Invalid teacher id", 404));
	}

	const newFeedback = await prisma.feedback.create({
		data: {
			teacherId: req.user.id,
			teacherName: teacher.name,
			student,
			feedback,
			testScore,
			subject,
			duration,
			createdAt: new Date(createdAt),
			weekday: weekDayInString,
			month: monthInString,
			topic
		}
	});

	return res.status(201).json({ success: true, data: newFeedback });
};

export const updateFeedback = async (req, res, next) => {
	const { id } = req.params;

	const feedback = await prisma.feedback.findUnique({
		where: {
			id
		}
	});

	if (!feedback) {
		return next(new ErrorHandler("Invalid feedback id", 404));
	}

	const updatedFeedback = await prisma.feedback.update({
		where: {
			id
		},
		data: {
			...req.body
		}
	});

	return res.status(200).json({ success: true, data: updatedFeedback });
};

export const deleteFeedback = async (req, res, next) => {
	const { id } = req.params;

	const feedback = await prisma.feedback.findUnique({
		where: {
			id
		}
	});

	if (!feedback) {
		return next(new ErrorHandler("Invalid feedback id", 404));
	}

	await prisma.feedback.delete({
		where: {
			id
		}
	});

	return res.status(200).json({ success: true, data: {} });
};
