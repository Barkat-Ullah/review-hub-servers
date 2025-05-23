import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {
    createContactMessage,
    getAllContactMessages,
    getContactMessageById,
    deleteContactMessageById,
} from './contactMessage.service';

export const createMessage = catchAsync(async (req: Request, res: Response) => {
    const data = await createContactMessage(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Contact message created successfully!',
        data,
    });
});

export const getMessages = catchAsync(async (_req: Request, res: Response) => {
    const data = await getAllContactMessages();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Contact messages retrieved successfully!',
        data,
    });
});

export const getMessageById = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await getContactMessageById(id);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Contact message retrieved successfully!',
            data,
        });
    },
);

export const deleteMessage = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await deleteContactMessageById(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Contact message deleted successfully!',
        data,
    });
});
