import bcrypt from 'bcrypt';
import { Secret } from 'jsonwebtoken';
import { User } from '../../../prisma/generated/prisma-client';
import { config } from '../../config/config';
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

export const UserService = {
    createUser,
    loginUser,
};
