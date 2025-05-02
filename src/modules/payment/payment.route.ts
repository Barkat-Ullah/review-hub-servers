import express from 'express';
import { paymentController } from './payment.controller';

const router = express.Router();

router.post('/create-payment', paymentController.createPayment);
// router.post('/success', handlePaymentSuccess);
// router.get('/', getAllPayments);
// router.get('/:userId', getPaymentsByUserId);

export const PaymentRoutes = router;
