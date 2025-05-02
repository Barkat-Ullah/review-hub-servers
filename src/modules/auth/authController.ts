import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import { UserService } from "./authService";
import status from "http-status";
import sendResponse from "../../utils/sendResponse";

const createUser: RequestHandler = catchAsync(async (req,res) => {
    console.log(req.body)
    const result = await UserService.createUser(req.body);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User Registration Successfully.",
      data: result,
    });
});

const loginUser: RequestHandler = catchAsync(async (req, res) => {
    const result = await UserService.loginUser(req.body);
    // console.log(result);
  
    const { refreshToken, ...others } = result;
    // console.log(refreshToken);
  
    res.cookie("refreshToken", refreshToken, {
      secure: false,
      httpOnly: true,
    });
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "User Login Successfully.",
      data: others,
    });
  });

export const UserController={
    createUser,
    loginUser
}