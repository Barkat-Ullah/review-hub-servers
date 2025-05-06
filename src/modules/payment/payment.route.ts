import express from 'express';
import { paymentController } from './payment.controller';

const router = express.Router();

router.post('/create-payment', paymentController.createPayment);
router.get('/verify-payment', paymentController.verifyPayment);
router.get('/', paymentController.getAllPayment);
router.get('/:id', paymentController.getPaymentById);

export const PaymentRoutes = router;
