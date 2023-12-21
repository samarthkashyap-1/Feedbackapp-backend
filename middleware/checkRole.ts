import ErrorHandler from "../utils/customError";

const checkRole = (role: string) => {
	return (req, _res, next) => {
		if (req.user.role !== role) {
			return next(new ErrorHandler("Unauthorized", 401));
		}

		next();
	};
};

export default checkRole;
