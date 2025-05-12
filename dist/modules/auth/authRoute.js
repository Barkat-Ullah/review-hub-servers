"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authController_1 = require("./authController");
const router = express_1.default.Router();
router.post("/create-user", authController_1.UserController.createUser);
router.post("/login", authController_1.UserController.loginUser);
router.post("/refresh-token", authController_1.UserController.refreshToken);
exports.AuthRoutes = router;
