import bcrypt from 'bcrypt';
import status from 'http-status';
import { Secret } from 'jsonwebtoken';

import { config } from '../../config/config';
import AppError from '../../errors/AppError';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import prisma from '../../utils/prisma';
import { User } from '../../../generated/prisma';
import { UserJWTPayload } from '../review/reviewService';

const createUser = async (payload: User) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });

    if (isUserExist) {
        throw new Error('User Already Exist');
    }

    const hashPassword = await bcrypt.hash(payload.password, 12);

    const userData = {
        name: payload.name,
        email: payload.email,
        username: payload.username,
        password: hashPassword,
    };

    const result = await prisma.user.create({
        data: {
            ...userData,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    // Generate tokens after successful user creation (same as login)
    const accessToken = jwtHelpers.generateToken(
        {
            email: result.email,
            role: result.role,
            userId: result.id,
        },
        config.ACCESS_TOKEN_SECRET as string,
        config.ACCESS_TOKEN_EXPIRY as string,
    );

    const refreshToken = jwtHelpers.generateToken(
        {
            email: result.email,
            role: result.role,
            userId: result.id,
        },
        config.REFRESH_TOKEN_SECRET as Secret,
        config.REFRESH_TOKEN_EXPIRY as string,
    );

    return {
        user: result,
        accessToken,
        refreshToken,
    };
};
const loginUser = async (payload: { email: string; password: string }) => {
    const userData = await prisma.user.findUnique({
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
    const isCorrectPassword: boolean = await bcrypt.compare(
        payload.password,
        userData.password,
    );

    if (!isCorrectPassword) {
        throw new Error('Your Password is incorrect..');
    }

    const accessToken = jwtHelpers.generateToken(
        {
            email: userData.email,
            role: userData.role,
            userId: userData.id,
        },
        config.ACCESS_TOKEN_SECRET as string,
        config.ACCESS_TOKEN_EXPIRY as string,
    );

    const refreshToken = jwtHelpers.generateToken(
        {
            email: userData.email,
            role: userData.role,
            userId: userData.id,
        },
        config.REFRESH_TOKEN_SECRET as Secret,
        config.REFRESH_TOKEN_EXPIRY as string,
    );
    return {
        accessToken,
        refreshToken,
    };
};

const generateNewAccessToken = async (
    refreshToken: string,
): Promise<string> => {
    const decoded = jwtHelpers.verifyToken(
        refreshToken,
        config.REFRESH_TOKEN_SECRET as string,
    );

    const { userId } = decoded;

    // checking if the user is exist
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
            isDeleted: false,
        },
    });

    if (!user) {
        throw new AppError(status.NOT_FOUND, 'This user is not found!');
    }

    // generating token
    const accessToken = jwtHelpers.generateToken(
        {
            email: user.email,
            role: user.role,
            userId: user.id,
        },
        config.ACCESS_TOKEN_SECRET as string,
        config.ACCESS_TOKEN_EXPIRY as string,
    );
    return accessToken;
};
const getAllUser = async () => {
    const result = await prisma.user.findMany();
    return result;
};

const getMyProfile = async (user: UserJWTPayload) => {
    const foundUser = await prisma.user.findUnique({
        where: { id: user.userId },
    });

    if (!foundUser) throw new Error('User not found');

    return foundUser;
};

const updateProfile = async (
    user: UserJWTPayload,
    updatedData: Partial<{ name: string; contactNo: string }>,
) => {
    const updatedUser = await prisma.user.update({
        where: { id: user.userId },
        data: updatedData,
    });

    return updatedUser;
};
export const UserService = {
    createUser,
    loginUser,
    generateNewAccessToken,
    getMyProfile,
    updateProfile,
    getAllUser,
};
