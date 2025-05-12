"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    try {
        const dataToValidate = req.body.data
            ? JSON.parse(req.body.data)
            : req.body;
        req.body = schema.parse(dataToValidate);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validate = validate;
