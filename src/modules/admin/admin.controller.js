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