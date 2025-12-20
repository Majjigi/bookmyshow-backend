import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/userRoutes.js";
import movieRouter from "./routes/movieRoutes.js";
import venueRouter from "./routes/venueRoutes.js";
import showRouter from "./routes/showRoutes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/venues", venueRouter);
app.use("/api/v1/shows", showRouter);

export default app;
