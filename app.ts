import cors from "cors";
import express, { Express } from "express";
import morgan from "morgan";
import "express-async-errors";
import errorHandler from "./middleware/errorHandler";
import feedbackRouter from "./routes/feedbackRouter";
import teacherRouter from "./routes/teacherRouter";
import adminRouter from "./routes/adminRouter";

const app: Express = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
	res.send("Hello World");
});

app.use("/feedbacks", feedbackRouter);
app.use("/teachers", teacherRouter);
app.use("/admin", adminRouter);

app.use(errorHandler);

export default app;
