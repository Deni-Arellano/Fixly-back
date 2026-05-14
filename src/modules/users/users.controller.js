import * as userValidation from './users.validation.js';
import * as userService from "./users.service.js";
import * as catalogos from "../../config/catalogos.js";


export const registrarCliente = async (req, res) => {
    try {
        const datosCliente = req.body;
        //console.log(datosCliente)

        //Validar datos usuario
        const result = userValidation.clienteRegistroSchema.safeParse(datosCliente);


        if (!result.success) {

            let errores = {};

            errores = result.error.issues.reduce((acc, err) => {
                const campo = err.path.length ? err.path[err.path.length - 1] : 'general';
                acc[campo] = err.message;
                return acc;
            }, {});

            return res.status(422).json({
                codigo: 422,
                estatus: 'fail',
                mensaje: 'Errores de validación.',
                datos: null,
                paginacion: null,
                errores: errores
            });
        }
        // insertamos rol
        datosCliente.rol_id = catalogos.ROLES.CLIENTE;
        datosCliente.estado_id = catalogos.ESTADOS_USUARIO.ACTIVO;
        // Agregar a base de datos
        //console.log("listo")
        //console.log(datosCliente)

        const resultadoUsuario = await userService.registrarCliente(datosCliente);


        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Usuario creado correctamente',
            datos: resultadoUsuario,
            paginacion: null,
            errores: null
        });

    } catch (error) {
        console.log(error)
        const codigoEstatus = error.codigo || 500;
        const mensaje = 'Error al crear el usuario';

        return res.status(codigoEstatus).json({
            codigo: codigoEstatus,
            estatus: 'fail',
            mensaje: mensaje,
            datos: null,
            paginacion: null,
            errores: { general: error.message || 'Ha ocurrido un error inesperado' }
        });
    }
}

export const registrarPrestador = async (req, res) => {
    try {
        const datosPrestador = req.body;


        //console.log(datosPrestador);

        //Validar datos usuario
        const result = userValidation.prestadorRegistroSchema.safeParse(datosPrestador);


        if (!result.success) {

            let errores = {};

            errores = result.error.issues.reduce((acc, err) => {
                const campo = err.path.length ? err.path[err.path.length - 1] : 'general';
                acc[campo] = err.message;
                return acc;
            }, {});

            return res.status(422).json({
                codigo: 422,
                estatus: 'fail',
                mensaje: 'Errores de validación.',
                datos: null,
                paginacion: null,
                errores: errores
            });
        }
        // insertamos rol y estado
        datosPrestador.usuario.rol_id = catalogos.ROLES.PRESTADOR;
        datosPrestador.usuario.estado_id = catalogos.ESTADOS_USUARIO.ACTIVO;

        // Agregar a base de datos
        const resultadoUsuario = await userService.registrarPrestador(datosPrestador);


        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Usuario creado correctamente',
            datos: resultadoUsuario,
            paginacion: null,
            errores: null
        });


    } catch (error) {
        console.log(error)
        const codigoEstatus = error.codigo || 500;
        const mensaje = 'Error al crear el usuario';

        return res.status(codigoEstatus).json({
            codigo: codigoEstatus,
            estatus: 'fail',
            mensaje: mensaje,
            datos: null,
            paginacion: null,
            errores: { general: error.message || 'Ha ocurrido un error inesperado' }
        });

    }

}

export const verPerfil = async (req, res) => {
    
    try {
        const idUsuario = Number(req.usuario.id_usuario);
        const idRol = Number(req.usuario.id_rol);



        const resultado = await userService.obtenerUsuario(idUsuario, idRol);

        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Usuario obtenido correctamente',
            datos: resultado
        });

    } catch (error) {
        console.log(error)
        const codigoEstatus = error.codigo || 500;
        const mensaje = 'No se pudo obtener el usuario';

        return res.status(codigoEstatus).json({
            codigo: codigoEstatus,
            estatus: 'fail',
            mensaje: mensaje,
            datos: null,
            paginacion: null,
            errores: { general: error.message || 'Ha ocurrido un error inesperado' }
        });
    }
}

export const verPerfilID = async (req, res) => {
    
    try {
        const idUsuario = Number(req.params.id);

        const resultado = await userService.obtenerUsuarioID(idUsuario);

        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Usuario obtenido correctamente',
            datos: resultado
        });

    } catch (error) {
        console.log(error)
        const codigoEstatus = error.codigo || 500;
        const mensaje = 'No se pudo obtener el usuario';

        return res.status(codigoEstatus).json({
            codigo: codigoEstatus,
            estatus: 'fail',
            mensaje: mensaje,
            datos: null,
            paginacion: null,
            errores: { general: error.message || 'Ha ocurrido un error inesperado' }
        });
    }
}



export const editarPerfil = async (req,res) => {
    try  {
        const idUsuario = Number(req.usuario.id_usuario);
        const idRolUsuario = Number(req.usuario.id_rol);
        const datosUsuario = req.body;

        let result;

        if (idRolUsuario == catalogos.ROLES.CLIENTE) {
            result = userValidation.clienteEdicionPerfilSchema.safeParse(datosUsuario);
        } else if (idRolUsuario == catalogos.ROLES.PRESTADOR) {
            result = userValidation.prestadorEdicionPerfilSchema.safeParse(datosUsuario);
        } else {
            const error = new Error('Rol no autorizado');
            error.codigo = 403;
            throw error;
        }

        if (!result.success) {
            const errores = result.error.issues.reduce((acc, err) => {
                const campo = err.path.length ? err.path[err.path.length - 1] : 'general';
                acc[campo] = err.message;
                return acc;
            }, {});

            return res.status(422).json({
                codigo: 422,
                estatus: 'fail',
                mensaje: 'Errores de validación.',
                datos: null,
                paginacion: null,
                errores: errores
            });
        }

        const resultadoUsuario = await userService.editarPerfil(idUsuario, idRolUsuario, datosUsuario);

        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Usuario actualizado correctamente',
            datos: resultadoUsuario
        });

    } catch (error){
        console.log(error)
        const codigoEstatus = error.codigo || 500;
        const mensaje = 'No se pudo editar el usuario';

        return res.status(codigoEstatus).json({
            codigo: codigoEstatus,
            estatus: 'fail',
            mensaje: mensaje,
            datos: null,
            paginacion: null,
            errores: { general: error.message || 'Ha ocurrido un error inesperado'  }
            });
    }
    
}