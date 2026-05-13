import * as serviceRequestValidation from './service-request.validation.js';
import * as serviceRequestService from "./service-request.service.js";
import * as catalogos from "../../config/catalogos.js";


export const obtenerSolicitudesParciales = async (req, res) => {
    
    try {
        const idUsuario = Number(req.usuario.id_usuario);
        const idRol = Number(req.usuario.id_rol);



        const resultado = await serviceRequestService.obtenerSolicitudesParciales(idUsuario, idRol);

        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Solicitudes obtenidas correctamente',
            datos: resultado
        });

    } catch (error) {
        console.log(error)
        const codigoEstatus = error.codigo || 500;
        const mensaje = 'Error al obtener las solictudes';

        return res.status(codigoEstatus).json({
            codigo: codigoEstatus,
            estatus: 'fail',
            mensaje: mensaje,
            datos: null,
            paginacion: null,
            errores: { general: error.message || 'Ha ocurrido un error inesperado' }
        });
    }
}

export const solicitarServicio = async (req, res) => {
    try {
        const idUsuario = Number(req.usuario.id_usuario);
        //console.log("id del usuario que esta solicitando el servicio:", idUsuario)
        const datosSolicitud = req.body;

        const resultadoValidacion = serviceRequestValidation.solicitudServicioSchema.safeParse(datosSolicitud);

        if (!resultadoValidacion.success) {

            let errores = {};
            resultadoValidacion.error.issues.forEach(error => {
                const campo = error.path[0];
                errores[campo] = error.message;
            })
            return res.status(422).json({
                codigo: 422,
                estatus: 'fail',
                mensaje: 'Errores de validación.',
                datos: null,
                paginacion: null,
                errores: errores
            });
        }

        const resultado = await serviceRequestService.solicitarServicio(idUsuario, datosSolicitud);

        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Solicitud creada correctamente',
            datos: null,
            paginacion: null,
            errores: null
            
        })
        

    }catch (error){
        console.log(error)
        const codigoEstatus = error.codigo || 500;
        const mensaje = 'Error al crear la solicitud';

        return res.status(codigoEstatus).json({
            codigo: codigoEstatus,
            estatus: 'fail',
            mensaje: mensaje,
            datos: null,
            paginacion: null,
            errores: { general: error.message || 'Ha ocurrido un error inesperado' }
        });
    }
}


export const obtenerDetalleSolicitud = async (req, res) => {
    try {
        const idSolicitud = Number(req.params.id);
        const idUsuario = Number(req.usuario.id_usuario);
        const idRol = Number(req.usuario.id_rol);

        
        if (isNaN(idSolicitud)) {
            return res.status(422).json({
                codigo: 422, 
                estatus: 'fail',
                mensaje: 'ID de solicitud inválido',
                datos: null,
                paginacion: null,
                errores: {id: 'El ID de la solicitud debe ser un número'}  
            })
        }

        const resultado = await serviceRequestService.obtenerDetalleSolicitud(idSolicitud, idUsuario, idRol);

        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Detalle de la solicitud obtenido correctamente',
            datos: resultado,
            paginacion: null,
            errores: null
        })

    } catch (error) {
        console.log(error)
        const codigoEstatus = error.codigo || 500;
        const mensaje = 'Error al obtener el detalle de la solicitud';

        if (error.codigo === 404) {
            return res.status(404).json({
                codigo: 404,
                estatus: 'fail',
                mensaje: 'Solicitud no encontrada para este usuario',
                datos: null,
                paginacion: null,
                errores: { id: 'No se encontró la solicitud para este usuario' }
            });
        }

        return res.status(codigoEstatus).json({
            codigo: codigoEstatus,
            estatus: 'fail',
            mensaje: mensaje,
            datos: null,
            paginacion: null,
            errores: { general: error.message || 'Ha ocurrido un error inesperado' }
        });
    }
}