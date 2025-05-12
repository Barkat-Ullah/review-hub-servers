"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentValidation = void 0;
const zod_1 = require("zod");
const createComment = zod_1.z.object({
    content: zod_1.z.string({ required_error: 'Content is required' }),
    reviewId: zod_1.z.string({ required_error: 'ReviewId is required' }),
    parentId: zod_1.z.string({ required_error: 'ParentId is required' }).optional(),
});
exports.commentValidation = {
    createComment,
};
