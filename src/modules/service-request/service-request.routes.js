import { Router } from 'express';
import * as serviceRequestController from './service-request.controller.js';
import * as authMiddleware from '../../middlewares/auth.middleware.js';
import * as permisos from '../../config/permisos.js';


const router = Router();

//Ves los datos parciales de una solicitud
router.get('/verSolicitudes', authMiddleware.verificarToken, serviceRequestController.obtenerSolicitudesParciales);

router.post('/solicitarServicio', authMiddleware.verificarToken, authMiddleware.autorizarRol(permisos.PERMISOS.SOLICITAR_SERVICIO), serviceRequestController.solicitarServicio);

router.get('/verDetalleSolicitud/:id', authMiddleware.verificarToken, serviceRequestController.obtenerDetalleSolicitud);

router.get('/:id/calificada', authMiddleware.verificarToken, serviceRequestController.verificarSolicitudCalificada);

router.put('/:id/cancelar', authMiddleware.verificarToken, authMiddleware.autorizarRol(permisos.PERMISOS.CANCELAR_SOLICITUD), serviceRequestController.cancelarSolicitud);

router.put('/:id/aceptar', authMiddleware.verificarToken, authMiddleware.autorizarRol(permisos.PERMISOS.ACEPTAR_SOLICITUD), serviceRequestController.aceptarSolicitud);

router.put('/:id/finalizar', authMiddleware.verificarToken, authMiddleware.autorizarRol(permisos.PERMISOS.FINALIZAR_SOLICITUD), serviceRequestController.finalizarSolicitud);

router.put('/editarSolicitud/:id', authMiddleware.verificarToken, authMiddleware.autorizarRol(permisos.PERMISOS.EDITAR_SOLICITUD), serviceRequestController.editarSolicitud);

export default router;
