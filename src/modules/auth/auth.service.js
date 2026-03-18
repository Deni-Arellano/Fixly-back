import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import * as userModel from '../users/users.model.js';


export const loginService = async (correo, contrasena) => {

    
    //Verificar que el usuario exista (email)
    const usuario = await userModel.encontrarUsuarioPorEmail(correo);

    if (!usuario){ //No existe el usuario
        const error = new Error('Usuario no encontrado');
        error.codigo = 404;
        throw error;
    }

    //Verificar estado del usuario
    const estado = await userModel.estadoDelUsuario(correo)
    if (!estado || estado.activo == 0){
        const error = new Error('Tu cuenta está actualmente inactiva. Por favor, comunícate con soporte para más información');
        error.codigo = 403;
        throw error;
    }

    //Verificar la contraseña
    const  esCorrecta = await bcrypt.compare(contrasena, usuario.contrasena_hash);

    if (!esCorrecta){ // contrasela incorrecta
        const error = new Error('Contraseña incorrecta')
        error.codigo = 401;
        throw error;
    }
    return usuario;
    
}

export const generarToken = (usuario) => {
    const token = jwt.sign(
        { id: usuario.id_usuario, usuario: usuario.email },
        process.env.SECRET_JWT_KEY,
        {
            expiresIn: '2h'
        }
    );

    return token;
}

export const refreshToken = (usuario) => {
    const token = jwt.sign(
        { id: usuario.id_usuario, usuario: usuario.email },
        process.env.SECRET_JWT_KEY_REFRESH,
        {
            expiresIn: '12h'
        }
    );

    return token;
}