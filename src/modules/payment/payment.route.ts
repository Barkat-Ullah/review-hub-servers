import express from 'express';
import { paymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { User_Role } from '../../../prisma/generated/prisma-client';

const router = express.Router();

router.post('/create-payment', paymentController.createPayment);
router.get('/verify-payment', paymentController.verifyPayment);
router.get('/my-payment', auth(User_Role.USER), paymentController.getMyPayment);
router.get('/', paymentController.getAllPayment);
router.get('/:id', paymentController.getPaymentById);

export const PaymentRoutes = router;
