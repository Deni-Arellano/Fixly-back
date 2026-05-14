import * as serviceRequestModel from '../service-request/service-request.model.js';

import * as catalogos from "../../config/catalogos.js";

//formatear datos para mostrar los detalles de la solicitud
const formatearDireccion = (direccion) => {
    const { calle, numero_exterior, numero_interior, colonia, ciudad, estado, codigo_postal } = direccion;
    
    let direccionFormato = `${calle} #${numero_exterior}`;
    
    if (numero_interior) {
        direccionFormato += `, apt. ${numero_interior}`;
    }
    
    direccionFormato += `, ${colonia}, ${ciudad}, ${estado}. ${codigo_postal}`;
    
    return direccionFormato;
}

const formatearNombreCompleto = (nombre, apellido_paterno, apellido_materno) => {
    return [nombre, apellido_paterno, apellido_materno].filter(Boolean).join(' ');
}

const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();
    
    let horas = date.getHours();
    const minutos = String(date.getMinutes()).padStart(2, '0');
    
    const periodo = horas >= 12 ? 'pm' : 'am';
    horas = horas % 12 || 12;
    
    return `${dia} de ${mes} de ${año}, ${horas}:${minutos} ${periodo}`;
}

const formatearDetalleSolicitud = (datos, tipoUsuario) => {
    const resultado = {
        id: datos.id,
        servicio_id: datos.servicio_id,
        nombre_servicio: datos.nombre_servicio,
        estado_id: datos.estado_id,
        estado_solicitud: datos.estado_solicitud,
        descripcion: datos.descripcion,
        direccion: formatearDireccion(datos),
        referencia: datos.referencia,
        creado_en: formatearFecha(datos.created_at)
    };
    
    if (tipoUsuario === 'cliente') {
        resultado.nombre_prestador = formatearNombreCompleto(datos.nombre_prestador, datos.apellido_paterno, datos.apellido_materno);
        resultado.foto_perfil = datos.foto_perfil;
        resultado.telefono = datos.telefono;
    }
    
    return resultado;
}

export const obtenerSolicitudesParciales = async (idUsuario, idRol) => {

    if (idRol == catalogos.ROLES.CLIENTE){
        const resultado = await serviceRequestModel.obtenerSolicitudesCliente(idUsuario);
        return resultado;

    } else if (idRol == catalogos.ROLES.PRESTADOR){
        const resultado = await serviceRequestModel.obtenerSolicitudesPrestdor(idUsuario);
        return resultado;

    } else {
        const error = new Error('Rol no autorizado');
        error.codigo = 403;
        throw error;

    }
}


export const solicitarServicio = async (idUsuario, datosSolicitud) => {
    const resultado = await serviceRequestModel.solicitarServicio(idUsuario, datosSolicitud);
    
    return resultado;
}




export const obtenerDetalleSolicitud = async (idSolicitud, idUsuario, idRol) => {

    if (idRol == catalogos.ROLES.CLIENTE) {
        const datos = await serviceRequestModel.obtenerDetalleSolicitudCliente(idSolicitud, idUsuario);
        
        if (!datos) {
            const error = new Error('Solicitud no encontrada');
            error.codigo = 404;
            throw error;
        }
        
        return formatearDetalleSolicitud(datos, 'cliente');

    } else if (idRol == catalogos.ROLES.PRESTADOR) {
        const datos = await serviceRequestModel.obtenerDetalleSolicitudPrestador(idSolicitud, idUsuario);
        
        if (!datos) {
            const error = new Error('Solicitud no encontrada');
            error.codigo = 404;
            throw error;
        }
        
        return formatearDetalleSolicitud(datos, 'prestador');

    } else {
        const error = new Error('Rol no autorizado');
        error.codigo = 403;
        throw error;
    }
}



export const cancelarSolicitud = async (idSolicitud, idCliente) => {
  
    const solicitud = await serviceRequestModel.obtenerSolicitudPorId(idSolicitud);
    
    if (!solicitud) {
        const error = new Error('Solicitud no encontrada');
        error.codigo = 404;
        throw error;
    }
    
    if (solicitud.cliente_id !== idCliente) {
        const error = new Error('No tienes permiso para cancelar esta solicitud');
        error.codigo = 403;
        throw error;
    }
    
    if (solicitud.estado_id !== 1) {
        const error = new Error('Solo se pueden cancelar solicitudes en estado PENDIENTE');
        error.codigo = 422;
        throw error;
    }
    
    await serviceRequestModel.actualizarEstadoSolicitud(idSolicitud, 4);
    
    return { mensaje: 'Solicitud cancelada correctamente' };
}


export const aceptarSolicitud = async (idSolicitud, idPrestadorUsuario) => {
    const solicitud = await serviceRequestModel.obtenerSolicitudPorId(idSolicitud);
    
    if (!solicitud) {
        const error = new Error('Solicitud no encontrada');
        error.codigo = 404;
        throw error;
    }
    
    if (solicitud.estado_id !== 1) {
        const error = new Error('Solo se pueden aceptar solicitudes en estado PENDIENTE');
        error.codigo = 422;
        throw error;
    }
    

    const idPrestador = await serviceRequestModel.obtenerIdPrestadorPorUsuario(idPrestadorUsuario);
    
    if (!idPrestador) {
        const error = new Error('No se encontró el perfil de prestador');
        error.codigo = 404;
        throw error;
    }
    
    if (solicitud.prestador_id !== idPrestador) {
        const error = new Error('No tienes permiso para aceptar esta solicitud');
        error.codigo = 403;
        throw error;
    }
    
    await serviceRequestModel.actualizarEstadoSolicitud(idSolicitud, 2);
    
    return { mensaje: 'Solicitud aceptada correctamente' };
}


export const finalizarSolicitud = async (idSolicitud, idPrestadorUsuario) => {
    const solicitud = await serviceRequestModel.obtenerSolicitudPorId(idSolicitud);
    
    if (!solicitud) {
        const error = new Error('Solicitud no encontrada');
        error.codigo = 404;
        throw error;
    }
    
    if (solicitud.estado_id !== 2) {
        const error = new Error('Solo se pueden finalizar solicitudes en estado ACEPTADA');
        error.codigo = 422;
        throw error;
    }
    
    const idPrestador = await serviceRequestModel.obtenerIdPrestadorPorUsuario(idPrestadorUsuario);
    
    if (!idPrestador) {
        const error = new Error('No se encontró el perfil de prestador');
        error.codigo = 404;
        throw error;
    }
    

    if (solicitud.prestador_id !== idPrestador) {
        const error = new Error('No tienes permiso para finalizar esta solicitud');
        error.codigo = 403;
        throw error;
    }
    

    await serviceRequestModel.actualizarEstadoSolicitud(idSolicitud, 3);
    
    return { mensaje: 'Solicitud finalizada correctamente' };
}