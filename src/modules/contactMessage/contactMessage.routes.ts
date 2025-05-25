import express from 'express';
import {
    createMessage,
    getMessages,
    getMessageById,
    deleteMessage,
} from './contactMessage.controller';

const router = express.Router();
router.get('/', getMessages);
router.post('/', createMessage);

router.get('/:id', getMessageById);
router.delete('/:id', deleteMessage);

export const ContactMessageRoutes = router;
