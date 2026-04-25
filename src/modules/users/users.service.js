import bcrypt from "bcrypt";
import * as userModel from '../users/users.model.js';
import pool from "../../config/db.js";

import { ROLES } from "../../config/catalogos.js";

export const registrarCliente = async (datosUsuario) => {
    // Verificar que el correo no esté repetido, teléfono y rfc no esté repetido

    const repetido = await userModel.verificarCorreoRepetido(datosUsuario.correo);
    //console.log(repetido)
    if (repetido){
        const mensaje = 'El correo ya está registrado';
        const error = new Error(mensaje);
        error.codigo = 409;
        throw error;
    }
    const contrasena_hash = await bcrypt.hash(datosUsuario.password, 12);


    datosUsuario.password = contrasena_hash; 

    const usuario = await userModel.agregarUsuario(datosUsuario);

    return usuario;

    
} 

export const registrarPrestador = async (datosUsuario) => {
    const conn = await pool.getConnection();
    try{
        await conn.beginTransaction();

        const repetido = await userModel.verificarCorreoRepetido(datosUsuario.usuario.correo);
        console.log(repetido)
        if (repetido){
            const mensaje = 'El correo ya está registrado';
            const error = new Error(mensaje);
            error.codigo = 409;
            throw error;
        }
        const contrasena_hash = await bcrypt.hash(datosUsuario.usuario.password, 12);


        datosUsuario.usuario.password = contrasena_hash; 



        const idUsuario = await userModel.agregarUsuarioConConn(conn, datosUsuario.usuario);

        const datosTablaPrestador = {
            usuario_id: idUsuario, 
            descripcion: datosUsuario.datos_prestador.descripcion
            };
        const idPrestador = await userModel.insertarPrestador(conn, datosTablaPrestador);

        const datosServicios = {
            prestador_id: idPrestador, 
            servicios: datosUsuario.datos_prestador.servicios
            };
        await userModel.insertarServicios(conn, datosServicios);

        await conn.commit();
        return {id: idUsuario};
    } catch (error){
        await conn.rollback();
        throw error;
        
    } finally{
        conn.release();
    }
        
}

export const obtenerUsuario = async (idUsuario, id_rol) => {

    if (id_rol == ROLES.CLIENTE){
        const resultado = await userModel.obtenerUsuarioPorId(idUsuario);
        if (!resultado){
            const error = new Error('El usuario no existe');
            error.codigo = 404;
            throw error;
        }

        return resultado;
        

    } else if (id_rol == ROLES.PRESTADOR){
        const resultadoDatosUsuario = await userModel.obtenerPrestadorPorId(idUsuario);
        if (!resultadoDatosUsuario){
            const error = new Error('El usuario no existe');
            error.codigo = 404;
            throw error;
        }

        const resultadoPromedioYCalidficaciones = await userModel.obtenerPromedioYComentarios(
            resultadoDatosUsuario.id_prestador
        );

        const serviciosRaw = resultadoDatosUsuario.servicios;
        let servicios = [];
        if (serviciosRaw) {
            servicios = typeof serviciosRaw === "string" ? JSON.parse(serviciosRaw) : serviciosRaw;
            servicios = servicios.filter(Boolean);
        }

        return {
            usuario: {
                id: resultadoDatosUsuario.id,
                nombre: resultadoDatosUsuario.nombre,
                apellido_paterno: resultadoDatosUsuario.apellido_paterno,
                apellido_materno: resultadoDatosUsuario.apellido_materno,
                correo: resultadoDatosUsuario.correo,
                telefono: resultadoDatosUsuario.telefono,
                foto_perfil: resultadoDatosUsuario.foto_perfil,
                rol_id: resultadoDatosUsuario.rol_id,
                estado_id: resultadoDatosUsuario.estado_id,
                created_at: resultadoDatosUsuario.created_at
            },
            prestador: {
                id_prestador: resultadoDatosUsuario.id_prestador,
                descripcion: resultadoDatosUsuario.descripcion,
                servicios,
                calificaciones: resultadoPromedioYCalidficaciones
            }
        };

    } else {
        const error = new Error('Rol no autorizado');
        error.codigo = 403;
        throw error;

    }
}



///Anterior proyecto

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