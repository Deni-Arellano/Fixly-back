import * as adminModel from './admin.model.js';
import { ROLES } from '../../config/catalogos.js';

export const obtenerUsuarios = async() => {
    const usuarios = await adminModel.obtenerUsuarios();

    if(!usuarios || usuarios.length === 0){
        const error = new Error('No se encontraron usuarios');
        error.codigo = 404;
        throw error;
    }

    return usuarios.map(usuario => {
        return {
            id: usuario.id,
            nombre_completo: [
                usuario.nombre,
                usuario.apellido_paterno,
                usuario.apellido_materno
            ].filter(Boolean).join(" "),
            correo: usuario.correo,
            telefono: usuario.telefono,
            rol_id: usuario.rol_id,
            estado_id: usuario.estado_id
        }
    });
}



export const cambiarEstadoUsuario = async (id_usuario, nuevoEstado) => {
    const usuario = await adminModel.obtenerUsuarioPorId(id_usuario);

    if (!usuario) {
        const error = new Error('Usuario no encontrado');
        error.codigo = 404;
        throw error;
    }

    const resultado = await adminModel.actualizarEstadoUsuario(id_usuario, nuevoEstado);

    return resultado;

}


export const buscarUsuarios = async(busqueda) => {
    const rolNombre = busqueda.toUpperCase().trim();
    let rolId = null;
    
    if (ROLES[rolNombre]) {
        rolId = ROLES[rolNombre];
    }

    const usuarios = await adminModel.buscarUsuarios(busqueda, rolId);

    if(!usuarios || usuarios.length === 0){
        const error = new Error('No se encontraron usuarios');
        error.codigo = 404;
        throw error;
    }

    return usuarios.map(usuario => {
        return {
            id: usuario.id,
            nombre_completo: [
                usuario.nombre,
                usuario.apellido_paterno,
                usuario.apellido_materno
            ].filter(Boolean).join(" "),
            correo: usuario.correo,
            telefono: usuario.telefono,
            rol_id: usuario.rol_id,
            estado_id: usuario.estado_id
        }
    });

}