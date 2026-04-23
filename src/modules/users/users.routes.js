import { Router } from 'express';
import * as userController from './users.controller.js';
import * as authMiddleware from '../../middlewares/auth.middleware.js';
import * as userMiddleware from '../../middlewares/users.middleware.js';
import * as permisos from '../../config/permisos.js';


const router = Router();
//Crear usuario
router.post('/registrarProveedor', authMiddleware.verificarToken, authMiddleware.autorizarRol(permisos.PERMISOS.CREAR_USUARIO_ADMINISTRADOR), userController.registrarPrestador);
router.post('/registrarCliente', userController.registrarCliente); // Público sin middleware

export default router;