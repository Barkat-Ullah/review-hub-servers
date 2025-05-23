import { Router } from 'express';
import { testimonialController } from './testimonial.controller';

const router = Router();

router.post('/', testimonialController.createTestimonial);
router.get('/', testimonialController.getAllTestimonials);

export const testimonialRoutes = router;
