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
                expiresIn: '2h'
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



export const refresh = async (req, res) => {
    try {
        const refreshToken = req.body?.refreshToken;

        if (!refreshToken) {
            return res.status(406).json({
                codigo: 406,
                estatus: 'fail',
                mensaje: 'No hay token de actualización',
                datos: null,
                paginacion: null,
                errores: { general: 'No autorizado' }
            });
        }

        // Verificar el refresh token
        const decodificado = jwt.verify(refreshToken, process.env.SECRET_JWT_KEY_REFRESH);
        
        const usuarioDecodificado = {
            id_usuario: decodificado.id,
            email: decodificado.usuario
        };

        const nuevoAccessToken = authService.generarToken(usuarioDecodificado);
        const nuevoRefreshToken = authService.refreshToken(usuarioDecodificado);

        return res.status(200).json({
            codigo: 200,
            estatus: 'success',
            mensaje: 'Tokens actualizados exitosamente',
            datos: {
                accessToken: nuevoAccessToken,
                refreshToken: nuevoRefreshToken,
                tokenType: 'Bearer',
                expiresIn: '2h'
            },
            paginacion: null,
            errores: null
        });

    } catch (error) {
        
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(406).json({
                codigo: 406,
                estatus: 'fail',
                mensaje: 'Token de actualización inválido',
                datos: null,
                paginacion: null,
                errores: { general: 'No autorizado' }
            });
        }

        
        return res.status(500).json({
            codigo: 500,
            estatus: 'fail',
            mensaje: 'Error al actualizar token',
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
            mensaje: 'Error al encerrar sesión',
            datos: null,
            paginacion: null,
            errores: { general: error.message }
        });
    }
}