import bcrypt from 'bcrypt';
import status from 'http-status';
import { Secret } from 'jsonwebtoken';
import { User } from '../../../prisma/generated/prisma-client';
import { config } from '../../config/config';
import AppError from '../../errors/AppError';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import prisma from '../../utils/prisma';

const createUser = async (payload: User) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    // console.log("isUserExist",isUserExist)

    if (isUserExist) {
        throw new Error('User Already Exist');
    }

    const hashPassword = await bcrypt.hash(payload.password, 12);

    // console.log(hashPassword)

    const userData = {
        name: payload.name,
        email: payload.email,
        username: payload.username,
        password: hashPassword,
    };

    // console.log(userData)
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
    console.log('result', result);
    return result;
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

    // console.log(isCorrectPassword);

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

export const UserService = {
    createUser,
    loginUser,
    generateNewAccessToken,
};
