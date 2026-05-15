import { Router } from 'express';
import * as authController from './auth.controller.js';
import { verificarToken } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.put('/cambiarPassword', verificarToken, authController.cambiarContrasena);


export default router;
