"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    var _a;
    // console.log(err);
    res.status((_a = err.statusCode) !== null && _a !== void 0 ? _a : http_status_1.default.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || 'Something went wrong',
    });
};
exports.default = globalErrorHandler;
