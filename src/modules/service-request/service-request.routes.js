import { Router } from 'express';
import * as serviceRequestController from './service-request.controller.js';
import * as authMiddleware from '../../middlewares/auth.middleware.js';
import * as permisos from '../../config/permisos.js';


const router = Router();

//Ves los datos parciales de una solicitud
router.get('/verSolicitudes', authMiddleware.verificarToken, serviceRequestController.obtenerSolicitudesParciales);

export default router;
