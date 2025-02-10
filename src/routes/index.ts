import { Router } from 'express';
import { usersRoutes } from './api/userRoutes';  // Import user routes
import { thoughtsRouter } from './api/thoughtRoutes'; // Import thoughts routes if applicable

const router = Router();

// ✅ Register individual route handlers
router.use('/users', usersRoutes);
router.use('/thoughts', thoughtsRouter); // If applicable

export default router;
