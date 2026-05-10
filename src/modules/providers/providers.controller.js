import * as providersService from './providers.service.js';

export const obtenerPrestadoresPorCategoria = async (req, res) => {
    try {
        const categoria_id = Number(req.params.categoria_id);

        
        if (isNaN(categoria_id) || categoria_id <= 0) {
            return res.status(422).json({
                codigo: 422,
                estatus: 'fail',
                mensaje: 'El ID de la categoría debe ser un número válido mayor a 0',
                datos: null,
                paginacion: null,
                errores: { categoria_id: 'ID inválido' }
            });
        }

        const prestadores = await providersService.obtenerPrestadoresPorCategoria(categoria_id);

        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Prestadores obtenidos correctamente',
            datos: prestadores,
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
                mensaje: 'No hay prestadores disponibles',
                datos: null,
                paginacion: null,
                errores: { categoria_id: error.message }
            });
        }

        return res.status(codigoEstatus).json({
            codigo: codigoEstatus,
            estatus: 'fail',
            mensaje: 'No se pudieron obtener los prestadores',
            datos: null,
            paginacion: null,
            errores: { general: error.message || 'Ha ocurrido un error inesperado' }
        });
    }
}

