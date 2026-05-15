import * as authValidation from './auth.validation.js';
import * as authService from "./auth.service.js";
import jwt from 'jsonwebtoken';


export const login = async (req, res) => {
    try{
        const datosLogin = req.body
        //console.log(datosLogin)

        const result = authValidation.loginSchema.safeParse(datosLogin);

    
        if (!result.success) {

            let errores = {};
            
            errores = result.error.issues.reduce((acc, err) => {
                acc[err.path[0]] = err.message;
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

        //LLamamos al método
        const resultadoUsuario = await authService.loginService(datosLogin.correo, datosLogin.contrasena);

        const token = authService.generarToken(resultadoUsuario);
        // Demo básica: no usamos refresh token por ahora.
        // const tokenRefresh = authService.refreshToken(resultadoUsuario);


        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Login exitoso',
            datos: {
                accessToken: token,
                // refreshToken: tokenRefresh,
                tokenType: 'Bearer',
                expiresIn: '2h',
                id_usuario: resultadoUsuario.id,
                id_rol: resultadoUsuario.rol_id
            },
            paginacion: null,
            errores: null
        });

    }catch (error){
        const codigoEstatus = error.codigo || 500;
        let mensaje;

        if ([401, 404].includes(error.codigo)) {
            mensaje = 'Credenciales inválidas';
        } else if (error.codigo === 403) {
            mensaje = 'Cuenta desactivada';
        } else {
            mensaje = 'Error de autenticación';
        }

        
        return res.status(codigoEstatus).json({
            codigo: codigoEstatus,
            estatus: 'fail',
            mensaje: mensaje,
            datos: null,
            paginacion: null,
            errores: { general: error.message }
        });
    }
}


export const logout = async (req, res) => { ////PENDIENTE
    try {
        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Logout exitoso',
            datos: null,
            paginacion: null,
            errores: null
        });

    } catch (error) {
        return res.status(500).json({
            codigo: 500,
            estatus: 'fail',
            mensaje: 'Error al cerrar sesión',
            datos: null,
            paginacion: null,
            errores: { general: error.message }
        });
    }
}

export const cambiarContrasena = async (req, res) => {
    try {
        const { contrasena_actual, contrasena_nueva, contrasena_confirmacion } = req.body;
        const idUsuario = req.usuario.id_usuario;

        
        const result = authValidation.cambiarContraseiaSchema.safeParse({
            contrasena_actual,
            contrasena_nueva,
            contrasena_confirmacion
        });

        if (!result.success) {
            let errores = {};
            
            errores = result.error.issues.reduce((acc, err) => {
                acc[err.path[0]] = err.message;
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

        
        await authService.cambiarContraseñaService(idUsuario, contrasena_actual, contrasena_nueva);

        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Contraseña actualizada correctamente',
            datos: null,
            paginacion: null,
            errores: null
        });

    } catch (error) {
        const codigoEstatus = error.codigo || 500;
        let mensaje;

        if (error.codigo === 401) {
            mensaje = 'La contraseña actual es incorrecta';
        } else if (error.codigo === 404) {
            mensaje = 'Usuario no encontrado';
        } else {
            mensaje = 'Error al cambiar la contraseña';
        }

        return res.status(codigoEstatus).json({
            codigo: codigoEstatus,
            estatus: 'fail',
            mensaje: mensaje,
            datos: null,
            paginacion: null,
            errores: { general: error.message }
        });
    }
}