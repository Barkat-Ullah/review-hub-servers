"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidation = void 0;
const zod_1 = require("zod");
const createValidation = zod_1.z.object({
    name: zod_1.z.string({ required_error: 'Name is required' }),
});
exports.categoryValidation = {
    createValidation,
};
