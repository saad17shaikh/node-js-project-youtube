import { Router } from "express";
import { user, userRegister } from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multerupload.js";

const router = Router();

router.post("/register",userRegister)
router.post("/user",user)

// router.post(
//   "/register",
// //   upload.fields([
// //     { name: "avatar", maxCount: 1, name: "coverImage", maxCount: 1 },
// //   ]),
//   userRegister
// );

export default router;
