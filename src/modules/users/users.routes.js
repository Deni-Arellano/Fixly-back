import { Router } from 'express';
import * as userController from './users.controller.js';
import * as authMiddleware from '../../middlewares/auth.middleware.js';
import * as permisos from '../../config/permisos.js';
import multer from 'multer';


const router = Router();
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		if (file.mimetype && file.mimetype.startsWith('image/')) {
			return cb(null, true);
		}
		return cb(new Error('Solo se permiten imagenes'));
	}
});
//Crear usuario
router.post('/registrarPrestador', authMiddleware.verificarToken, authMiddleware.autorizarRol(permisos.PERMISOS.REGISTRAR_PRESTADOR), userController.registrarPrestador);
router.post('/registrarCliente', userController.registrarCliente); // Público sin middleware

//Ver perfil
router.get('/verPerfil', authMiddleware.verificarToken, userController.verPerfil);
router.get('/verPerfil/:id', authMiddleware.verificarToken, userController.verPerfilID);
router.get('/VerPrestador/:id', authMiddleware.verificarToken, userController.obtenerDatosPrestador);

//editar Cliente ( mi perfil)
router.put(
	'/editarPerfil',
	authMiddleware.verificarToken,
	upload.single('imagen'),
	userController.editarPerfil
);


export default router;