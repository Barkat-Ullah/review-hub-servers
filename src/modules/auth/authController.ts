import { RequestHandler } from 'express';
import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './authService';
import { UserJWTPayload } from '../review/reviewService';

const createUser: RequestHandler = catchAsync(async (req, res) => {
    // console.log(req.body)
    const result = await UserService.createUser(req.body);
    const { user, accessToken } = result;

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User Registration Successfully.',
        data: { user, accessToken },
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

const getAllUser = catchAsync(async (req, res) => {
    const result = await UserService.getAllUser();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All User retrieved successfully!',
        data: result,
    });
});

const getMyProfile = catchAsync(async (req, res) => {
    const user = req.user as UserJWTPayload;

    const result = await UserService.getMyProfile(user);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User profile retrieved successfully!',
        data: result,
    });
});

const updateProfile = catchAsync(async (req, res) => {
    const user = req.user as UserJWTPayload;
    const updatedData = req.body;
    const result = await UserService.updateProfile(user, updatedData);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User profile updated successfully!',
        data: result,
    });
});

export const UserController = {
    createUser,
    loginUser,
    refreshToken,
    getMyProfile,
    updateProfile,
    getAllUser,
};
