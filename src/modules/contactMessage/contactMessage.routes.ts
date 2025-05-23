import express from 'express';
import {
    createMessage,
    getMessages,
    getMessageById,
    deleteMessage,
} from './contactMessage.controller';

const router = express.Router();

router.post('/', createMessage);
router.get('/', getMessages);
router.get('/:id', getMessageById);
router.delete('/:id', deleteMessage);

export const ContactMessageRoutes = router;
