import { Router } from 'express';
import * as reviewController from './review.controller.js';
import * as authMiddleware from '../../middlewares/auth.middleware.js';
import * as permisos from '../../config/permisos.js';

const router = Router();

router.post('/:id/calificar', authMiddleware.verificarToken, authMiddleware.autorizarRol(permisos.PERMISOS.CALIFICAR_SERVICIO), reviewController.crearCalificacion);

router.get('/prestador/:prestadorId/calificaciones', authMiddleware.verificarToken, reviewController.obtenerCalificacionesPrestador);

router.get('/prestador/:prestadorId/promedio', authMiddleware.verificarToken, reviewController.obtenerPromedioCalificacionesPrestador);

export default router;
