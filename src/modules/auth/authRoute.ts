import express from "express";
import { UserController } from "./authController";
const router = express.Router();

router.post("/create-user", UserController.createUser);
router.post("/login", UserController.loginUser);

export const AuthRoutes = router;
