import { Router } from 'express';
import * as providersController from './providers.controller.js';
import * as authMiddleware from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/categoria/:categoria_id', authMiddleware.verificarToken, providersController.obtenerPrestadoresPorCategoria);

export default router;
