import { Router } from 'express';
import * as authController from './auth.controller.js';

const router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
// Demo básica: endpoint de refresh desactivado temporalmente.
// router.post('/refresh', authController.refresh);

export default router;
