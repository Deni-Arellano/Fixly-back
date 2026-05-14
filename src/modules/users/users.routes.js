import { Router } from 'express';
import * as userController from './users.controller.js';
import * as authMiddleware from '../../middlewares/auth.middleware.js';
import * as permisos from '../../config/permisos.js';


const router = Router();
//Crear usuario
router.post('/registrarPrestador', authMiddleware.verificarToken, authMiddleware.autorizarRol(permisos.PERMISOS.REGISTRAR_PRESTADOR), userController.registrarPrestador);
router.post('/registrarCliente', userController.registrarCliente); // Público sin middleware

//Ver perfil
router.get('/verPerfil', authMiddleware.verificarToken, userController.verPerfil);
router.get('/verPerfil/:id', authMiddleware.verificarToken, userController.verPerfilID);
router.get('/prestador/:id', authMiddleware.verificarToken, userController.obtenerDatosPrestador);

//editar Cliente ( mi perfil)
router.put('/editarPerfil', authMiddleware.verificarToken, userController.editarPerfil)


export default router;