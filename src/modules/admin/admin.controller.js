import * as adminService from './admin.service.js';

export const obtenerUsuarios = async(req, res) => {
    try {
        const usuarios = await adminService.obtenerUsuarios();

        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Usuarios obtenidos correctamente',
            datos: usuarios,
            paginacion: null,
            errores: null
        });

    } catch (error) {
        console.log(error)
        const codigoEstatus = error.codigo || 500;

        if (codigoEstatus === 404) {
            return res.status(404).json({
                codigo: 404,
                estatus: 'fail',
                mensaje: 'No hay usuarios disponibles',
                datos: null,
                paginacion: null,
                errores: { categoria_id: error.message }
            });
        }

        return res.status(codigoEstatus).json({
            codigo: codigoEstatus,
            estatus: 'fail',
            mensaje: 'No se pudieron obtener los usuarios',
            datos: null,
            paginacion: null,
            errores: { general: error.message || 'Ha ocurrido un error inesperado' }
        });
    }
}

export const cambiarEstadoUsuario = async(req, res) => {
    try {
        const idUsuario = Number(req.params.id);
        const { estado_id } = req.body;

        if (isNaN(idUsuario) || idUsuario <= 0) {
            return res.status(422).json({
                codigo: 422,
                estatus: 'fail',
                mensaje: 'El ID del usuario debe ser un número válido',
                datos: null,
                paginacion: null,
                errores: { id: 'ID inválido' }
            });
        }

        if (estado_id === undefined) {
            return res.status(422).json({
                codigo: 422,
                estatus: 'fail',
                mensaje: 'El campo estado_id es requerido',
                datos: null,
                paginacion: null,
                errores: { estado_id: 'Campo requerido' }
            });
        }

        const nuevoEstado = Number(estado_id);
        if (![1, 2].includes(nuevoEstado)) {
            return res.status(422).json({
                codigo: 422,
                estatus: 'fail',
                mensaje: 'El estado debe ser 1 (ACTIVO) o 2 (SUSPENDIDO)',
                datos: null,
                paginacion: null,
                errores: { estado_id: 'Estado inválido' }
            });
        }

        const resultado = await adminService.cambiarEstadoUsuario(idUsuario, nuevoEstado);

        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Estado del usuario actualizado correctamente',
            datos: null,
            paginacion: null,
            errores: null
        });

    } catch (error) {
        console.log(error)
        const codigoEstatus = error.codigo || 500;
        const mensaje = 'No se pudo actualizar el estado del usuario';

        if (codigoEstatus === 404) {
            return res.status(404).json({
                codigo: 404,
                estatus: 'fail',
                mensaje: 'Usuario no encontrado',
                datos: null,
                paginacion: null,
                errores: { categoria_id: error.message }
            });
        }

        return res.status(codigoEstatus).json({
            codigo: codigoEstatus,
            estatus: 'fail',
            mensaje: 'No se pudo actualizar el estado del usuario',
            datos: null,
            paginacion: null,
            errores: { general: error.message || 'Ha ocurrido un error inesperado' }
        });
    }
}