import * as adminModel from './admin.model.js';
import { ROLES, ESTADOS_USUARIO } from '../../config/catalogos.js';


const mapearRol = (rolId) => {
    const rolesMap = {
        [ROLES.ADMIN]: 'Admin',
        [ROLES.PRESTADOR]: 'Prestador',
        [ROLES.CLIENTE]: 'Cliente'
    };
    return rolesMap[rolId] || 'Desconocido';
};

const mapearEstado = (estadoId) => {
    const estadosMap = {
        [ESTADOS_USUARIO.ACTIVO]: 'Activo',
        [ESTADOS_USUARIO.SUSPENDIDO]: 'Suspendido'
    };
    return estadosMap[estadoId] || 'Desconocido';
};

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
            estado_id: usuario.estado_id,
            rol: mapearRol(usuario.rol_id),
            estado: mapearEstado(usuario.estado_id)
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
            estado_id: usuario.estado_id,
            rol: mapearRol(usuario.rol_id),
            estado: mapearEstado(usuario.estado_id)
        }
    });

}