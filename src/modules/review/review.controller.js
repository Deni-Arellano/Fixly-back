import * as reviewValidation from './review.validation.js';
import * as reviewService from './review.service.js';

export const crearCalificacion = async (req, res) => {
    try {
        const idSolicitud = Number(req.params.id);
        const idCliente = Number(req.usuario.id_usuario);
        const datosCalificacion = req.body;

        const resultadoValidacion = reviewValidation.crearCalificacionSchema.safeParse(datosCalificacion);

        if (!resultadoValidacion.success) {
            let errores = {};
            resultadoValidacion.error.issues.forEach(error => {
                const campo = error.path[0];
                errores[campo] = error.message;
            });
            
            return res.status(422).json({
                codigo: 422,
                estatus: 'fail',
                mensaje: 'Errores de validación.',
                datos: null,
                paginacion: null,
                errores: errores
            });
        }


        await reviewService.crearCalificacion(idSolicitud, idCliente, datosCalificacion);

        return res.status(201).json({
            codigo: 201,
            estatus: 'success',
            mensaje: 'Calificación creada correctamente',
            datos: null,
            paginacion: null,
            errores: null
        });

    } catch (error) {
        console.log(error);
        const codigoEstatus = error.codigo || 500;
        const mensaje = 'Error al crear la calificación';

        return res.status(codigoEstatus).json({
            codigo: codigoEstatus,
            estatus: 'fail',
            mensaje: mensaje,
            datos: null,
            paginacion: null,
            errores: { general: error.message || 'Ha ocurrido un error inesperado' }
        });
    }
};

export const obtenerCalificacionesPrestador = async (req, res) => {
    try {
        const prestadorId = Number(req.params.prestadorId);

        const calificaciones = await reviewService.obtenerCalificacionesPrestador(prestadorId);

        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Calificaciones obtenidas correctamente',
            datos: calificaciones,
            paginacion: null,
            errores: null
        });

    } catch (error) {
        console.log(error);
        const codigoEstatus = error.codigo || 500;
        const mensaje = 'Error al obtener las calificaciones';

        return res.status(codigoEstatus).json({
            codigo: codigoEstatus,
            estatus: 'fail',
            mensaje: mensaje,
            datos: null,
            paginacion: null,
            errores: { general: error.message || 'Ha ocurrido un error inesperado' }
        });
    }
};

export const obtenerPromedioCalificacionesPrestador = async (req, res) => {
    try {
        const prestadorId = Number(req.params.prestadorId);

        const promedio = await reviewService.obtenerPromedioCalificacionesPrestador(prestadorId);

        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Promedio de calificaciones obtenido correctamente',
            datos: promedio,
            paginacion: null,
            errores: null
        });

    } catch (error) {
        console.log(error);
        const codigoEstatus = error.codigo || 500;
        const mensaje = 'Error al obtener el promedio de calificaciones';

        return res.status(codigoEstatus).json({
            codigo: codigoEstatus,
            estatus: 'fail',
            mensaje: mensaje,
            datos: null,
            paginacion: null,
            errores: { general: error.message || 'Ha ocurrido un error inesperado' }
        });
    }
};
