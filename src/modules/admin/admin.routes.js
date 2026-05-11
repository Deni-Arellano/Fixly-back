import { Router } from 'express';
import * as adminController from './admin.controller.js';
import * as authMiddleware from '../../middlewares/auth.middleware.js';
import * as permisos from '../../config/permisos.js';

const router = Router();

router.get('/usuarios', authMiddleware.verificarToken, authMiddleware.autorizarRol(permisos.PERMISOS.VER_USUARIOS),adminController.obtenerUsuarios);

export default router;
