import express from "express";
import { UserController } from "./authController";
const router = express.Router();

router.post("/create-user", UserController.createUser);
router.post("/login", UserController.loginUser);
router.post("/refresh-token", UserController.refreshToken);

export const AuthRoutes = router;
