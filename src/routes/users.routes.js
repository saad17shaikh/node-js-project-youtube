import { Router } from "express";
import { userRegister } from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multerupload.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userRegister
);

export default router;
