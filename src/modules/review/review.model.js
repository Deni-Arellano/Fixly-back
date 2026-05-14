import pool from "../../config/db.js";

export const crearCalificacion = async (solicitudId, clienteId, prestadorId, estrellas, comentario) => {
    const [result] = await pool.query(
        `INSERT INTO calificaciones (solicitud_id, cliente_id, prestador_id, estrellas, comentario) 
         VALUES (?, ?, ?, ?, ?)`,
        [solicitudId, clienteId, prestadorId, estrellas, comentario || null]
    );
    return result;
};

export const obtenerSolicitudPorId = async (idSolicitud) => {
    const [rows] = await pool.query(
        `SELECT 
            s.id,
            s.cliente_id,
            s.prestador_id,
            s.estado_id
         FROM solicitudes s
         WHERE s.id = ?`,
        [idSolicitud]
    );
    return rows[0] || null;
};

export const verificarCalificacionExistente = async (solicitudId) => {
    const [rows] = await pool.query(
        `SELECT id FROM calificaciones WHERE solicitud_id = ?`,
        [solicitudId]
    );
    return rows.length > 0;
};

export const obtenerCalificacionesPrestador = async (prestadorId) => {
    const [rows] = await pool.query(
        `SELECT 
            c.id,
            c.solicitud_id,
            c.estrellas,
            c.comentario,
            c.created_at,
            u.nombre as nombre_cliente,
            u.apellido_paterno,
            u.apellido_materno,
            u.foto_perfil
         FROM calificaciones c
         INNER JOIN usuarios u ON c.cliente_id = u.id
         WHERE c.prestador_id = ?
         ORDER BY c.created_at DESC`,
        [prestadorId]
    );
    return rows;
};

export const obtenerPromedioCalificacionesPrestador = async (prestadorId) => {
    const [rows] = await pool.query(
        `SELECT 
            COUNT(*) as total_calificaciones,
            AVG(estrellas) as promedio_estrellas
         FROM calificaciones
         WHERE prestador_id = ?`,
        [prestadorId]
    );
    return rows[0];
};
