import pool from "../../config/db.js";

export const obtenerSolicitudesCliente = async (idUsuario) => {
    const [rows] = await pool.query(
    `SELECT 
        solicitudes.id, 
        solicitudes.servicio_id, 
        servicios.nombre as nombre_servicio, 
        solicitudes.estado_id, 
        estados_solicitudes.nombre as estado_solicitud, 
        solicitudes.descripcion FROM solicitudes
    INNER JOIN servicios
        ON solicitudes.servicio_id = servicios.id
    INNER JOIN estados_solicitudes
        ON solicitudes.estado_id = estados_solicitudes.id
    WHERE solicitudes.cliente_id = ?
    ORDER BY solicitudes.estado_id ASC`,
    [idUsuario]
    );
    return rows;
}

export const obtenerSolicitudesPrestdor = async (idPrestador) => {
    const [rows] = await pool.query(
    `SELECT 
        solicitudes.id, 
        solicitudes.servicio_id, 
        servicios.nombre as nombre_servicio, 
        solicitudes.estado_id, 
        estados_solicitudes.nombre as estado_solicitud, 
        solicitudes.descripcion FROM solicitudes
    INNER JOIN prestador
        ON solicitudes.prestador_id = prestador.id
    INNER JOIN servicios
        ON solicitudes.servicio_id = servicios.id
    INNER JOIN estados_solicitudes
        ON solicitudes.estado_id = estados_solicitudes.id
    WHERE prestador.usuario_id = ?
    ORDER BY solicitudes.estado_id ASC`,
    [idPrestador]
    );
    return rows;
}
