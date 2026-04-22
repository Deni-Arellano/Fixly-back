import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import * as userModel from '../users/users.model.js';


import * as catalogos from "../../config/catalogos.js";

export const loginService = async (correo, contrasena) => {

    
    //Verificar que el usuario exista (email)
    const usuario = await userModel.encontrarUsuarioPorEmail(correo);
    console.log(usuario)

    if (!usuario){ //No existe el usuario
        const error = new Error('Usuario no encontrado');
        error.codigo = 404;
        throw error;
    }

    //Verificar estado del usuario
    const estado = await userModel.estadoDelUsuario(correo)
    if (!estado || estado.estado_id == catalogos.ESTADOS_USUARIO.SUSPENDIDO){
        const error = new Error('Tu cuenta está actualmente inactiva. Por favor, comunícate con soporte para más información');
        error.codigo = 403;
        throw error;
    }

    //Verificar la contraseña
    const  esCorrecta = await bcrypt.compare(contrasena, usuario.password);

    if (!esCorrecta){ // contraseña incorrecta
        const error = new Error('Contraseña incorrecta')
        error.codigo = 401;
        throw error;
    }
    return usuario;
    
}

export const generarToken = (usuario) => {
    const token = jwt.sign(
        { id: usuario.id, usuario: usuario.correo },
        process.env.SECRET_JWT_KEY,
        {
            expiresIn: '2h'
        }
    );

    return token;
}

