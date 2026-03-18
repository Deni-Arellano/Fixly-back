import { Router } from 'express';
import * as userController from './users.controller.js';
import * as authMiddleware from '../../middlewares/auth.middleware.js';
import * as userMiddleware from '../../middlewares/users.middleware.js';
import * as permisos from '../../config/permisos.js';


const router = Router();
//Crear usuario
router.post('/crearAdministrador', authMiddleware.verificarToken, authMiddleware.autorizarRol(permisos.PERMISOS.CREAR_USUARIO_ADMINISTRADOR), userController.crearAdministrador);
router.post('/crearMiembro', userController.crearMiembro); // Público sin middleware
router.put('/editarUsuario/:id', authMiddleware.verificarToken, userMiddleware.puedeEditarUsuario, userController.editarUsuario);
router.put('/cambiarEstado/:id', authMiddleware.verificarToken, authMiddleware.autorizarRol(permisos.PERMISOS.CAMBIAR_ESTADO_USUARIO), userController.cambiarEstado);
router.get('/obtenerUsuario/:id', authMiddleware.verificarToken, userMiddleware.puedeVerUsuario, userController.verUsuario);
router.get('/obtenerUsuarios', authMiddleware.verificarToken, authMiddleware.autorizarRol(permisos.PERMISOS.VER_USUARIOS), userController.obtenerUsuarios);

export default router;