import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
export const app = express();
// For cors
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
// For limit of json coming
app.use(express.json({ limit: "16kb" }));
// For url encoded
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// For file upload
app.use(express.static("public"));
// For cookies
app.use(cookieParser());
