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

        

        return {
                id: resultado.id,
                nombre_completo: [
                    resultado.nombre,
                    resultado.apellido_paterno,
                    resultado.apellido_materno
                ].filter(Boolean).join(" "),
                nombre: resultado.nombre,
                apellido_paterno: resultado.apellido_paterno,
                apellido_materno: resultado.apellido_materno,
                correo: resultado.correo,
                telefono: resultado.telefono,
                foto_perfil: resultado.foto_perfil,
                rol_id: resultado.rol_id,
                estado_id: resultado.estado_id,
                created_at: resultado.created_at
            };
        

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
                nombre_completo: [
                    resultadoDatosUsuario.nombre,
                    resultadoDatosUsuario.apellido_paterno,
                    resultadoDatosUsuario.apellido_materno
                ].filter(Boolean).join(" "),
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

export const obtenerUsuarioID = async (idUsuario) => {
    const datosUsuario = await userModel.encontrarUsuarioPorIdConRol(idUsuario);
    const id_rol = datosUsuario.id_rol;

    if (id_rol == ROLES.CLIENTE){
        const resultado = await userModel.obtenerUsuarioPorId(idUsuario);
        if (!resultado){
            const error = new Error('El usuario no existe');
            error.codigo = 404;
            throw error;
        }

        

        return {
                id: resultado.id,
                nombre_completo: [
                    resultado.nombre,
                    resultado.apellido_paterno,
                    resultado.apellido_materno
                ].filter(Boolean).join(" "),
                nombre: resultado.nombre,
                apellido_paterno: resultado.apellido_paterno,
                apellido_materno: resultado.apellido_materno,
                correo: resultado.correo,
                telefono: resultado.telefono,
                foto_perfil: resultado.foto_perfil,
                rol_id: resultado.rol_id,
                estado_id: resultado.estado_id,
                created_at: resultado.created_at
            };
        

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
                nombre_completo: [
                    resultadoDatosUsuario.nombre,
                    resultadoDatosUsuario.apellido_paterno,
                    resultadoDatosUsuario.apellido_materno
                ].filter(Boolean).join(" "),
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



export const editarPerfil = async (idUsuario, idRol, datosUsuario) => {
    const conn = await pool.getConnection();
    try{
        await conn.beginTransaction();

        if (idRol == ROLES.CLIENTE){
            const filasAfectadas = await userModel.editarUsuario(conn, idUsuario, datosUsuario);
            if (!filasAfectadas){
                const error = new Error('No se actualizó ningún dato');
                error.codigo = 404;
                throw error;
            }
            await conn.commit();
        } else if (idRol == ROLES.PRESTADOR){
            const filasAfectadas = await userModel.editarUsuario(conn, idUsuario, datosUsuario.usuario);
            if (!filasAfectadas){
                const error = new Error('No se actualizó ningún dato del usuario');
                error.codigo = 404;
                throw error;
            }

            const filasPrestador = await userModel.editarTablaPrestador(
                conn,
                idUsuario,
                datosUsuario.datos_prestador.descripcion
            );
            if (!filasPrestador){
                const error = new Error('No se actualizó ningún dato del prestador');
                error.codigo = 404;
                throw error;
            }

            const prestador = await userModel.obtenerIdPrestador(conn, idUsuario);
            if (!prestador?.id){
                const error = new Error('No se encontró el prestador');
                error.codigo = 404;
                throw error;
            }

            await userModel.eliminarServiciosDePrestador(conn, prestador.id);
            await userModel.insertarServicios(conn, {
                prestador_id: prestador.id,
                servicios: datosUsuario.datos_prestador.servicios
            });

            await conn.commit();
        } else{
            const error = new Error('Rol no autorizado');
            error.codigo = 403;
            throw error;

        }
        
        return {id: idUsuario};
    } catch (error){
        await conn.rollback();
        throw error;
        
    } finally{
        conn.release();
    }
}

export const obtenerDatosPrestador = async (idPrestador) => {
    const datos = await userModel.obtenerPrestadorConCalificaciones(idPrestador);
    
    if (!datos) {
        const error = new Error('Prestador no encontrado');
        error.codigo = 404;
        throw error;
    }
    
    let servicios = [];
    if (datos.servicios) {
        try {
            const serviciosArray = typeof datos.servicios === 'string' 
                ? JSON.parse(datos.servicios) 
                : datos.servicios;
            servicios = Array.isArray(serviciosArray) 
                ? serviciosArray.filter(s => s && s.id !== null)
                : [];
        } catch (e) {
            servicios = [];
        }
    }
    
    return {
        usuario: {
            id: datos.id,
            nombre_completo: `${datos.nombre} ${datos.apellido_paterno} ${datos.apellido_materno}`.trim(),
            nombre: datos.nombre,
            apellido_paterno: datos.apellido_paterno,
            apellido_materno: datos.apellido_materno,
            correo: datos.correo,
            telefono: datos.telefono,
            foto_perfil: datos.foto_perfil,
            rol_id: datos.rol_id,
            estado_id: datos.estado_id,
            created_at: datos.created_at
        },
        prestador: {
            id_prestador: datos.id_prestador,
            descripcion: datos.descripcion,
            servicios: servicios,
            calificaciones: {
                promedio: datos.calificaciones.promedio,
                comentarios: datos.calificaciones.comentarios
            }
        }
    };
}

