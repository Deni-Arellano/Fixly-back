import { ROLES } from './catalogos.js';

export const PERMISOS = {
    REGISTRAR_PRESTADOR: [ROLES.ADMIN],
    SOLICITAR_SERVICIO: [ROLES.CLIENTE],
    VER_USUARIOS: [ROLES.ADMIN]
};