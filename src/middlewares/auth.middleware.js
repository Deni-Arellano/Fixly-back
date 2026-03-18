import * as userModel from '../modules/users/users.model.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const verificarToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                codigo: 401,
                estatus: 'fail',
                mensaje: 'Token de acceso requerido',
                datos: null,
                paginacion: null,
                errores: { general: 'No autorizado' }
            });
        }

        const tokenDecodificado = jwt.verify(token, process.env.SECRET_JWT_KEY);
        const usuario = await userModel.encontrarUsuarioPorIdConRol(tokenDecodificado?.id);

        if (!usuario) {
            return res.status(401).json({
                codigo: 401,
                estatus: 'fail',
                mensaje: 'Usuario no encontrado',
                datos: null,
                paginacion: null,
                errores: { general: 'Token inválido' }
            });
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                codigo: 401,
                estatus: 'fail',
                mensaje: 'Token inválido',
                datos: null,
                paginacion: null,
                errores: { general: 'Token malformado' }
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                codigo: 401,
                estatus: 'fail',
                mensaje: 'Token expirado',
                datos: null,
                paginacion: null,
                errores: { general: 'Token expirado' }
            });
        }

        return res.status(500).json({
            codigo: 500,
            estatus: 'fail',
            mensaje: 'Error al verificar token',
            datos: null,
            paginacion: null,
            errores: { general: error.message }
        });
    }
};

export const autorizarRol = (rolesPermitidos) => {
    return (req, res, next) => {
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

        if (rolesPermitidos.includes(req.usuario.id_rol)) {
            next();
        } else {
            return res.status(403).json({
                codigo: 403,
                estatus: 'fail',
                mensaje: 'Acceso no autorizado',
                datos: null,
                paginacion: null,
                errores: { general: 'No tienes permiso para acceder' }
            });
        }
    };
};