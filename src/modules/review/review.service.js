import * as reviewModel from './review.model.js';

const ESTADO_FINALIZADA = 3; 

export const crearCalificacion = async (solicitudId, idCliente, datosCalificacion) => {
    
    const solicitud = await reviewModel.obtenerSolicitudPorId(solicitudId);
    
    if (!solicitud) {
        const error = new Error('Solicitud no encontrada');
        error.codigo = 404;
        throw error;
    }
    

    if (solicitud.cliente_id !== idCliente) {
        const error = new Error('No tienes permiso para calificar esta solicitud');
        error.codigo = 403;
        throw error;
    }
    

    if (solicitud.estado_id !== ESTADO_FINALIZADA) {
        const error = new Error('Solo puedes calificar solicitudes finalizadas');
        error.codigo = 400;
        throw error;
    }
    

    const calificacionExistente = await reviewModel.verificarCalificacionExistente(solicitudId);
    
    if (calificacionExistente) {
        const error = new Error('Esta solicitud ya ha sido calificada');
        error.codigo = 400;
        throw error;
    }
    
   
    const resultado = await reviewModel.crearCalificacion(
        solicitudId,
        idCliente,
        solicitud.prestador_id,
        datosCalificacion.estrellas,
        datosCalificacion.comentario
    );
    
    return resultado;
};

export const obtenerCalificacionesPrestador = async (prestadorId) => {
    const calificaciones = await reviewModel.obtenerCalificacionesPrestador(prestadorId);
    return calificaciones;
};

export const obtenerPromedioCalificacionesPrestador = async (prestadorId) => {
    const promedio = await reviewModel.obtenerPromedioCalificacionesPrestador(prestadorId);
    const calificaciones = await reviewModel.obtenerCalificacionesPrestador(prestadorId);
    
    return {
        total_calificaciones: promedio.total_calificaciones || 0,
        promedio_estrellas: promedio.promedio_estrellas ? parseFloat(parseFloat(promedio.promedio_estrellas).toFixed(2)) : 0,
        calificaciones: calificaciones
    };
};
