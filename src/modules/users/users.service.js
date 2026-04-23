import bcrypt from "bcrypt";
import * as userModel from '../users/users.model.js';
import pool from "../../config/db.js";

import { ROLES } from "../../config/catalogos.js";

export const registrarCliente = async (datosUsuario) => {
    // Verificar que el correo no esté repetido, teléfono y rfc no esté repetido

    const repetido = await userModel.verificarCorreoRepetido(datosUsuario.correo);
    console.log(repetido)
    if (repetido){
        const mensaje = 'El correo ya está registrado';
        const error = new Error(mensaje);
        error.codigo = 409;
        throw error;
    }
    const contrasena_hash = await bcrypt.hash(datosUsuario.password, 12);


    datosUsuario.password = contrasena_hash; 

    const usuario = await userModel.agregarCliente(datosUsuario);

    return usuario;

    
} 

export const actualizarAutoEdicion = async (idUsuario, datosAEditar) => {
    if (!datosAEditar.datos_personales || Object.keys(datosAEditar.datos_personales).length === 0) {
        const error = new Error('No se enviaron datos personales para actualizar');
        error.codigo = 400;
        throw error;
    }
    const conexion = await pool.getConnection();
    try {
        // Solo validar teléfono si viene en la petición
        if (datosAEditar.datos_personales.telefono) {
            const repetido = await userModel.verificarTelefonoRepetido(datosAEditar.datos_personales.telefono, idUsuario);
            if (repetido) {
                const error = new Error('El teléfono ya está registrado');
                error.codigo = 409;
                throw error;
            }
        }
        const filasAfectadas = await userModel.editarTablaDatosPersonalesPorID(conexion, idUsuario, datosAEditar.datos_personales);
        if (filasAfectadas === 0) {
            const error = new Error('No se actualizó ningún dato');
            error.codigo = 404;
            throw error;
        }
    
        return datosAEditar;
    } finally {
        if (conexion) conexion.release();
    }
}

export const actualizarEdicionAdmin = async (idUsuario, datosAEditar) => {
        if (!idUsuario || isNaN(Number(idUsuario))) {
            throw new Error('idUsuario inválido en actualizarEdicionAdmin');
        }
        if (
            (!datosAEditar.usuario || Object.keys(datosAEditar.usuario).length === 0) &&
            (!datosAEditar.datos_personales || Object.keys(datosAEditar.datos_personales).length === 0)
        ) {
            const error = new Error('No se enviaron datos para actualizar');
            error.codigo = 400;
            throw error;
        }

    const conexion = await pool.getConnection();

    try {
        const es = await userModel.obtenerRolUsuario(idUsuario);
        if (es.id_rol !== ROLES.MIEMBRO && es.id_rol !== ROLES.INFLUENCER) {
            const error = new Error(`No tienes permiso para editar`);
            error.codigo = 403;
            throw error;
        }
        
        if (datosAEditar.datos_personales.rfc || datosAEditar.datos_personales.telefono) {
            const repetido = await userModel.verificarTelefonoRFCRepetido(idUsuario, datosAEditar.datos_personales);
            if (repetido && repetido.campo_repetido) {
                const error = new Error(`El ${repetido.campo_repetido} ya está registrado`);
                error.codigo = 409;
                throw error;
            }
        }

        await conexion.beginTransaction();
        const datosTablaDP = datosAEditar.datos_personales;
        const datosTablaU = datosAEditar.usuario;
        console.log(datosTablaU, datosTablaDP)

        //Actualización tabla usuarios
        if (datosTablaU && Object.keys(datosTablaU).length > 0) {
            const filasAfectadasU = await userModel.editarTablaUsuariosPorID(conexion, idUsuario, datosTablaU);
            if (filasAfectadasU === 0) {
                const error = new Error('No se actualizó ningún dato');
                error.codigo = 404;
                throw error;
            }
        }

        //Actualización tabla datos personales
        if (datosTablaDP && Object.keys(datosTablaDP).length > 0) {
            const filasAfectadasDP = await userModel.editarTablaDatosPersonalesPorID(conexion, idUsuario, datosTablaDP);
            if (filasAfectadasDP === 0) {
                const error = new Error('No se actualizó ningún dato');
                error.codigo = 404;
                throw error;
            }
        }
        await conexion.commit();
        return datosAEditar;
    } catch (error) {
        await conexion.rollback();
        if (!error.codigo) {
            error.message = 'Ha ocurrido un error inesperado';
            error.codigo = 500;
        }
        throw error;
    } finally {
        if (conexion) conexion.release();
    }
}

export const actualizarEdicionSuperAdmin = async (idUsuario, datosAEditar) => {
    if (
        (!datosAEditar.usuario || Object.keys(datosAEditar.usuario).length === 0) &&
        (!datosAEditar.datos_personales || Object.keys(datosAEditar.datos_personales).length === 0)
    ) {
        const error = new Error('No se enviaron datos para actualizar');
        error.codigo = 400;
        throw error;
    }

    const conexion = await pool.getConnection();

    try{
        const repetido = await userModel.verificarCorreoTelefonoRFCRepetidoEdit(idUsuario,datosAEditar);
        console.log('Repetido', repetido);
        if (repetido && repetido.campo_repetido) {
            const error = new Error(`El ${repetido.campo_repetido} ya está registrado`);
            error.codigo = 409;
            throw error;
        }

        await conexion.beginTransaction();

        const datosTablaDP = datosAEditar.datos_personales;
        const datosTablaU = datosAEditar.usuario;
    

        //Actualización tabla usuarios
        if (datosTablaU && Object.keys(datosTablaU).length > 0){

                console.log("empezando datos tabla U")
                const filasAfectadasU = await userModel.editarTablaUsuariosPorID(conexion, idUsuario, datosTablaU);

                console.log("terminando datos tabla U")
                if (filasAfectadasU === 0) {
                    const error = new Error('No se actualizó ningún dato');
                    error.codigo = 404;
                    throw error;
                }
        }

    
        //Actualización tabla datos personales
        if (datosTablaDP && Object.keys(datosTablaDP).length > 0){
        
            const filasAfectadasDP = await userModel.editarTablaDatosPersonalesPorID(conexion, idUsuario, datosTablaDP);
            if (filasAfectadasDP === 0) {
                const error = new Error('No se actualizó ningún dato');
                error.codigo = 404;
                throw error;
            }
        }

        await conexion.commit();
        return datosAEditar;

    } catch (error){
        await conexion.rollback();
        if (!error.codigo) {
            error.message = 'Ha ocurrido un error inesperado';
            error.codigo = 500;
        }
        throw error;

    } finally {
        if (conexion) conexion.release();
    }
    
}

export const editarEstadoUsuario = async (idUsuarioEditar, rolAdmin, idRolAdmin, idUsuarioAdmin, estado) => {
    // Obtener el rol del usuario a editar
    const datosRol = await userModel.obtenerRolUsuario(idUsuarioEditar)

    if (!datosRol){
        const error = new Error('No se encontro el usuario a editar');
        error.codigo = 404;
        throw error;
    }
    const rolUsuarioEditar = datosRol.rol_nombre; 
    const idRolUsuarioEditar =datosRol.id_rol;

    if (Number(idUsuarioEditar) === Number(idUsuarioAdmin)){
        const error = new Error('No puedes modificar tu propio estado de cuenta');
        error.codigo = 409;
        throw error;
    } else if (idRolAdmin === ROLES.ADMINISTRADOR && (idRolUsuarioEditar !== ROLES.MIEMBRO && idRolUsuarioEditar !== ROLES.INFLUENCER) ){
        const error = new Error('Los administradores solo pueden editar miembros e influencers');
        error.codigo = 403;
        throw error;
    }

    const filasAfectadas = await userModel.cambiarEstadoUsuario(idUsuarioEditar, estado.activo)
    if (filasAfectadas === 0) {
        const error = new Error('No se actualizó ningún dato');
        error.codigo = 404;
        throw error;
    }
    
    return estado 
    
    
}

export const obtenerUsuario = async (idUsuario) => {

    const resultado = await userModel.obtenerUsuarioPorId(idUsuario);

    if (!resultado){
        const error = new Error('El usuario no existe');
        error.codigo = 404;
        throw error;
    }

    // Estructurar los datos en el formato requerido
    const usuarioEstructurado = {
        usuario: {
            correo: resultado.correo,
            verificado: resultado.verificado , 
            id_rol: resultado.id_rol,
            rol_nombre: resultado.rol_nombre
        },
        datos_personales: {
            nombre: resultado.nombre,
            primer_apellido: resultado.primer_apellido,
            segundo_apellido: resultado.segundo_apellido,
            telefono: resultado.telefono,
            fecha_nacimiento: resultado.fecha_nacimiento,
            rfc: resultado.rfc
        }
    };

    if (usuarioEstructurado.usuario.id_rol !== ROLES.MIEMBRO && usuarioEstructurado.usuario.id_rol !== ROLES.INFLUENCER){
        delete usuarioEstructurado.usuario.verificado;
    };

    return usuarioEstructurado;
}

export const obtenerUsuarios = async (idTipoFiltro, idRolUsuario) => {
    let filtro = null;

    switch (idRolUsuario){
        case ROLES.SUPERADMINISTRADOR:
            filtro = idTipoFiltro || null;
            break
        case ROLES.ADMINISTRADOR:
            const permitidos = [ROLES.MIEMBRO, ROLES.INFLUENCER];

            if (!idTipoFiltro) {
            filtro = permitidos;
        } else {
            if (!permitidos.includes(idTipoFiltro)) {
                const error = new Error('No autorizado');
                error.codigo = 403;
                throw error;
            }
            filtro = idTipoFiltro;
        }
        break;
            
        
        default:
            const error = new Error('No tienes permiso para realizar esta acción');
            error.codigo = 403;
            throw error;

    }
    
    const resultado = await userModel.obtenerUsuarios(filtro);

    if (!resultado || resultado.length === 0) {
        const error = new Error('No se encontraron usuarios con los filtros especificados');
        error.codigo = 404;
        throw error;
    }
    
    return resultado;
}