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

export const solicitarServicio = async (idUsuario, datosSolicitud) => {
    const [result] = await pool.query(
        "INSERT INTO solicitudes (cliente_id, prestador_id, servicio_id, estado_id, descripcion, calle, numero_exterior, numero_interior, colonia, ciudad, estado, codigo_postal, referencia) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [idUsuario, datosSolicitud.prestador_id, datosSolicitud.servicio_id, 1, datosSolicitud.descripcion, datosSolicitud.calle, datosSolicitud.numero_exterior, datosSolicitud.numero_interior, datosSolicitud.colonia, datosSolicitud.ciudad, datosSolicitud.estado, datosSolicitud.codigo_postal, datosSolicitud.referencia]
    );

    return result;
}



export const obtenerDetalleSolicitudCliente = async (idSolicitud, idCliente) => {
    const [rows] = await pool.query(
         `SELECT 
            s.id,
            s.servicio_id,
            sv.nombre as nombre_servicio,
            s.estado_id,
            es.nombre as estado_solicitud,
            s.descripcion,
            s.calle,
            s.numero_exterior,
            s.numero_interior,
            s.colonia,
            s.ciudad,
            s.estado,
            s.codigo_postal,
            s.referencia,
            s.created_at,
            -- Datos del prestador
            u.nombre as nombre_prestador,
            u.apellido_paterno,
            u.apellido_materno,
            u.foto_perfil,
            u.telefono
        FROM solicitudes s
        INNER JOIN servicios sv ON s.servicio_id = sv.id
        INNER JOIN estados_solicitudes es ON s.estado_id = es.id
        INNER JOIN prestador p ON s.prestador_id = p.id
        INNER JOIN usuarios u ON p.usuario_id = u.id
        WHERE s.id = ? AND s.cliente_id = ?`,
        [idSolicitud, idCliente]
    );

    return rows[0];

}


export const obtenerDetalleSolicitudPrestador = async (idSolicitud, idPrestador) => {
    const [rows] = await pool.query(
        `SELECT 
            s.id,
            s.servicio_id,
            sv.nombre as nombre_servicio,
            s.estado_id,
            es.nombre as estado_solicitud,
            s.descripcion,
            s.calle,
            s.numero_exterior,
            s.numero_interior,
            s.colonia,
            s.ciudad,
            s.estado,
            s.codigo_postal,
            s.referencia,
            s.created_at,
            -- Datos del cliente
            u.nombre as nombre_cliente,
            u.apellido_paterno,
            u.apellido_materno,
            u.foto_perfil,
            u.telefono
        FROM solicitudes s
        INNER JOIN servicios sv ON s.servicio_id = sv.id
        INNER JOIN estados_solicitudes es ON s.estado_id = es.id
        INNER JOIN prestador p ON s.prestador_id = p.id
        INNER JOIN usuarios u ON s.cliente_id = u.id
        WHERE s.id = ? AND p.usuario_id = ?`,
        [idSolicitud, idPrestador]
    );
    return rows[0] || null;
}




export const obtenerSolicitudPorId = async (idSolicitud) => {
    const [rows] = await pool.query(
        `SELECT 
            s.id,
            s.cliente_id,
            s.prestador_id,
            s.estado_id,
            s.created_at
        FROM solicitudes s
        WHERE s.id = ?`,
        [idSolicitud]
    );
    return rows[0] || null;
}


export const verificarSolicitudCalificada = async (idSolicitud) => {
    const [rows] = await pool.query(
        `SELECT id FROM calificaciones WHERE solicitud_id = ? LIMIT 1`,
        [idSolicitud]
    );
    return rows.length > 0;
}


export const obtenerIdPrestadorPorUsuario = async (idUsuario) => {
    const [rows] = await pool.query(
        "SELECT id FROM prestador WHERE usuario_id = ?",
        [idUsuario]
    );
    return rows[0]?.id || null;
}


export const actualizarEstadoSolicitud = async (idSolicitud, nuevoEstadoId) => {
    const [result] = await pool.query(
        "UPDATE solicitudes SET estado_id = ? WHERE id = ?",
        [nuevoEstadoId, idSolicitud]
    );
    return result;
}



export const actualizarSolicitud = async (idSolicitud, datosSolicitud) => {
    
    const campos = [];
    const valores = [];

    if (datosSolicitud.calle !== undefined) {
        campos.push('calle = ?');
        valores.push(datosSolicitud.calle);
    }

    if (datosSolicitud.numero_exterior !== undefined) {
        campos.push('numero_exterior = ?');
        valores.push(datosSolicitud.numero_exterior);
    }

    if (datosSolicitud.numero_interior !== undefined) {
        campos.push('numero_interior = ?');
        valores.push(datosSolicitud.numero_interior || null);
    }

    if (datosSolicitud.colonia !== undefined) {
        campos.push('colonia = ?');
        valores.push(datosSolicitud.colonia);
    }

    if (datosSolicitud.ciudad !== undefined) {
        campos.push('ciudad = ?');
        valores.push(datosSolicitud.ciudad);
    }

    if (datosSolicitud.estado !== undefined) {
        campos.push('estado = ?');
        valores.push(datosSolicitud.estado);
    }

    if (datosSolicitud.codigo_postal !== undefined) {
        campos.push('codigo_postal = ?');
        valores.push(datosSolicitud.codigo_postal);
    }

    if (datosSolicitud.referencia !== undefined) {
        campos.push('referencia = ?');
        valores.push(datosSolicitud.referencia || null);
    }

    if (datosSolicitud.descripcion !== undefined) {
        campos.push('descripcion = ?');
        valores.push(datosSolicitud.descripcion || null);
    }

    
    if (campos.length === 0) {
        return { affectedRows: 0 };
    }

    valores.push(idSolicitud);

    const query = `UPDATE solicitudes SET ${campos.join(', ')} WHERE id = ?`;
    const [result] = await pool.query(query, valores);

    return result;
}
