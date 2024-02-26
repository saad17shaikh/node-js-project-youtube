import { Router } from "express";
import {
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multerupload.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Register User
router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userRegister
);
// Login User
router.post("/login", userLogin);
// Logout User
router.post("/logout", verifyUser,userLogout);
export default router;
