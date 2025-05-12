import { RequestHandler } from 'express';
import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './authService';

const createUser: RequestHandler = catchAsync(async (req, res) => {
    // console.log(req.body)
    const result = await UserService.createUser(req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User Registration Successfully.',
        data: result,
    });
});

const loginUser: RequestHandler = catchAsync(async (req, res) => {
    const result = await UserService.loginUser(req.body);

    const { refreshToken, accessToken } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true,
    });
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User Login Successfully.',
        data: { accessToken, refreshToken },
    });
});

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;    
    const accessToken = await UserService.generateNewAccessToken(refreshToken);    

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Access token is retrieved succesfully!',
        data: accessToken,
    });
});

export const UserController = {
    createUser,
    loginUser,
    refreshToken,
};
