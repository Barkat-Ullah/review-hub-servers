import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import { jwtHelpers } from "../helpers/jwtHelpers";
import { config } from "../config/config";
import prisma from "../utils/prisma";


const RoleValidation = (...roles: string[]) => {
  return async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        res
          .status(401)
          .json({ success: false, message: "You are not authorized !" });
        return;
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.ACCESS_TOKEN_SECRET as Secret
      );

      if (roles.length && !roles.includes(verifiedUser.role)) {
        res.status(403).json({
          success: false,
          message: "Forbidden! You don't have access.",
        });
        return;
      }

      const User = await prisma.user.findUnique({
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
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: "Unauthorized access!",
        error: error?.message || "Something went wrong",
      });
    }
  };
};

export default RoleValidation;