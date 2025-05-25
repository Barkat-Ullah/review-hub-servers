import { ContactCategory, ContactPriority } from '../../../generated/prisma';
import prisma from '../../utils/prisma';

export const createContactMessage = async (payload: {
    name: string;
    email: string;
    phone?: string;
    category: ContactCategory;
    subject?: string;
    message: string;
    priority: ContactPriority;
}) => {
    return await prisma.contactMessage.create({
        data: payload,
    });
};

export const getAllContactMessages = async () => {
    return await prisma.contactMessage.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const getContactMessageById = async (id: string) => {
    return await prisma.contactMessage.findUnique({
        where: { id },
    });
};

export const deleteContactMessageById = async (id: string) => {
    return await prisma.contactMessage.delete({
        where: { id },
    });
};
