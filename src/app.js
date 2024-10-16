import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
export const app = express();
// For cors
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
// For limit of json coming
app.use(express.json());
// For url encoded
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// For file upload
app.use(express.static("public"));
// For cookies
app.use(cookieParser());


// Import routes
import userRouter from "./routes/users.routes.js"

app.use("/api/v1/user",userRouter)