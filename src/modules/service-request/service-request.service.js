import * as serviceRequestModel from '../service-request/service-request.model.js';

import * as catalogos from "../../config/catalogos.js";

export const obtenerSolicitudesParciales = async (idUsuario, idRol) => {

    if (idRol == catalogos.ROLES.CLIENTE){
        const resultado = await serviceRequestModel.obtenerSolicitudesCliente(idUsuario);
        return resultado;

    } else if (idRol == catalogos.ROLES.PRESTADOR){
        const resultado = await serviceRequestModel.obtenerSolicitudesPrestdor(idUsuario);
        return resultado;

    } else {
        const error = new Error('Rol no autorizado');
        error.codigo = 403;
        throw error;

    }
}