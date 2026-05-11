import * as adminModel from './admin.model.js';

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
