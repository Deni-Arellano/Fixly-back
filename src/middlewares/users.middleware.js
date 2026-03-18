import * as userModel from '../modules/users/users.model.js';
import { ROLES } from '../config/catalogos.js';

export const puedeEditarUsuario = async (req, res, next) => {
    try {
        const idUsuario = Number(req.params.id);
        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            return res.status(400).json({
                codigo: 400,
                estatus: 'fail',
                mensaje: 'ID de usuario inválido',
                datos: null,
                paginacion: null,
                errores: { id: 'Debe ser un número entero mayor a cero' }
            });
        }

        if (!req.usuario?.id_rol) {
            return res.status(403).json({
                codigo: 403,
                estatus: 'fail',
                mensaje: 'Rol no encontrado',
                datos: null,
                paginacion: null,
                errores: { general: 'Usuario sin rol asignado' }
            });
        }

        let tipoEdicion = 'sin_permisos';

        const idUsuarioActual = Number(req.usuario.id_usuario);
        const idUsuarioAModificar = idUsuario; // Ya validado arriba
        const rolUsuarioActual = req.usuario.id_rol;

        if (idUsuarioActual === idUsuarioAModificar && rolUsuarioActual !== ROLES.SUPERADMINISTRADOR) {
            tipoEdicion = 'auto_edicion';
        } 
        else if (rolUsuarioActual === ROLES.SUPERADMINISTRADOR) {
            tipoEdicion = 'superadministrador_edicion';
        }
        
        else if (rolUsuarioActual === ROLES.ADMINISTRADOR) {
            const usuarioAEditar = await userModel.encontrarUsuarioPorIdConRol(idUsuarioAModificar);
            if (!usuarioAEditar) {
                return res.status(404).json({
                    codigo: 404,
                    estatus: 'fail',
                    mensaje: 'No se pudo verificar el usuario',
                    datos: null,
                    paginacion: null,
                    errores: { general: 'No se encontró el usuario a editar' }
                });
            }

            const rolUsuarioAEditar = usuarioAEditar.id_rol;
            if (rolUsuarioAEditar === ROLES.MIEMBRO || rolUsuarioAEditar === ROLES.INFLUENCER) {
                tipoEdicion = 'administrador_edicion';
            }
        }

        if (tipoEdicion === 'sin_permisos') {
            return res.status(403).json({
                codigo: 403,
                estatus: 'fail',
                mensaje: 'Acceso no autorizado',
                datos: null,
                paginacion: null,
                errores: { general: 'No tienes permiso para editar' }
            });
        }

        req.tipoEdicion = tipoEdicion;

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            codigo: 500,
            estatus: 'fail',
            mensaje: 'Ha ocurrido un error interno en el servidor',
            datos: null,
            paginacion: null,
            errores: { general: 'Intente nuevamente más tarde' }
        });
    }
};

export const puedeVerUsuario = async (req, res, next) => {
    try {

        const idUsuario = Number(req.params.id);
        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            return res.status(400).json({
                codigo: 400,
                estatus: 'fail',
                mensaje: 'ID de usuario inválido',
                datos: null,
                paginacion: null,
                errores: { id: 'Debe ser un número entero mayor a cero' }
            });
        }

        if (!req.usuario?.id_rol) {
            return res.status(403).json({
                codigo: 403,
                estatus: 'fail',
                mensaje: 'Rol no encontrado',
                datos: null,
                paginacion: null,
                errores: { general: 'Usuario sin rol asignado' }
            });
        }

        const idUsuarioActual = Number(req.usuario.id_usuario);
        const idUsuarioAVer = idUsuario; 
        const rolUsuarioActual = req.usuario.id_rol;

        const datosUsuario = await userModel.encontrarUsuarioPorIdConRol(idUsuarioAVer);
        if (!datosUsuario) {
            return res.status(404).json({
                codigo: 404,
                estatus: 'fail',
                mensaje: 'Usuario no encontrado',
                datos: null,
                paginacion: null,
                errores: { general: 'El usuario que intentas ver no existe' }
            });
        }

        const rolUsuarioAVer = datosUsuario.id_rol;

        if (idUsuarioActual === idUsuarioAVer) {
            return next();
        }

        if (rolUsuarioActual === ROLES.SUPERADMINISTRADOR) {
            return next();
        }

        if (rolUsuarioActual === ROLES.ADMINISTRADOR && 
            (rolUsuarioAVer === ROLES.MIEMBRO || rolUsuarioAVer === ROLES.INFLUENCER)) {
            return next();
        }
        return res.status(403).json({
            codigo: 403,
            estatus: 'fail',
            mensaje: 'Acceso no autorizado',
            datos: null,
            paginacion: null,
            errores: { general: 'No tienes permiso para ver este usuario' }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            codigo: 403,
            estatus: 'fail',
            mensaje: 'Ha ocurrido un error interno en el servidor',
            datos: null,
            paginacion: null,
            errores: { general: 'Intente nuevamente más tarde' }
        });
    }
};