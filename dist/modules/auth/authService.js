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
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = require("../../config/config");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    // console.log("isUserExist",isUserExist)
    if (isUserExist) {
        throw new Error('User Already Exist');
    }
    const hashPassword = yield bcrypt_1.default.hash(payload.password, 12);
    // console.log(hashPassword)
    const userData = {
        name: payload.name,
        email: payload.email,
        username: payload.username,
        password: hashPassword,
    };
    // console.log(userData)
    const result = yield prisma_1.default.user.create({
        data: Object.assign({}, userData),
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
    console.log('result', result);
    return result;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
            // status: User_Status.ACTIVE,
            isDeleted: false,
        },
    });
    // console.log(userData);
    if (!userData) {
        throw new Error('User not found..');
    }
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    // console.log(isCorrectPassword);
    if (!isCorrectPassword) {
        throw new Error('Your Password is incorrect..');
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        userId: userData.id,
    }, config_1.config.ACCESS_TOKEN_SECRET, config_1.config.ACCESS_TOKEN_EXPIRY);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        userId: userData.id,
    }, config_1.config.REFRESH_TOKEN_SECRET, config_1.config.REFRESH_TOKEN_EXPIRY);
    return {
        accessToken,
        refreshToken,
    };
});
const generateNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jwtHelpers_1.jwtHelpers.verifyToken(refreshToken, config_1.config.REFRESH_TOKEN_SECRET);
    const { userId } = decoded;
    // checking if the user is exist
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
            isDeleted: false,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found!');
    }
    // generating token
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        email: user.email,
        role: user.role,
        userId: user.id,
    }, config_1.config.ACCESS_TOKEN_SECRET, config_1.config.ACCESS_TOKEN_EXPIRY);
    return accessToken;
});
exports.UserService = {
    createUser,
    loginUser,
    generateNewAccessToken,
};
