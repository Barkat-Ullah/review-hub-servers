"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwtHelpers_1 = require("../helpers/jwtHelpers");
const config_1 = require("../config/config");
const prisma_1 = __importDefault(require("../utils/prisma"));
const RoleValidation = (...roles) => {
    return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (!token) {
                res
                    .status(401)
                    .json({ success: false, message: "You are not authorized !" });
                return;
            }
            const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.config.ACCESS_TOKEN_SECRET);
            if (roles.length && !roles.includes(verifiedUser.role)) {
                res.status(403).json({
                    success: false,
                    message: "Forbidden! You don't have access.",
                });
                return;
            }
            const User = yield prisma_1.default.user.findUnique({
                where: {
                    email: verifiedUser.email,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });
            // console.log(user);
            req.user = User;
            next();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: "Unauthorized access!",
                error: (error === null || error === void 0 ? void 0 : error.message) || "Something went wrong",
            });
        }
    });
};
exports.default = RoleValidation;
