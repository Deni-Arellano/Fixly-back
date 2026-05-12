import pool from '../../config/db.js';

export const obtenerUsuarios = async () => {
    const [rows] = await pool.query(
        "SELECT id, nombre, apellido_paterno, apellido_materno, correo, telefono, rol_id, estado_id FROM usuarios WHERE rol_id IN (2, 3) ORDER BY FIELD(rol_id, 2, 3), nombre ASC"
    );

    return rows;
}


export const obtenerUsuarioPorId = async(id_usuario) => {
    const [rows] = await pool.query(
        "SELECT id, nombre, estado_id FROM usuarios WHERE id = ? LIMIT 1", [id_usuario]
    
    );

    return rows[0];
}

export const actualizarEstadoUsuario = async(id_usuario, nuevo_estado) => {
    await pool.query(
        "UPDATE usuarios SET estado_id = ? WHERE id = ?", [nuevo_estado, id_usuario]
    );
    

    return true;
}



export const buscarUsuarios = async(busqueda, rol_id = null) => {
    let query = "SELECT id, nombre, apellido_paterno, apellido_materno, correo, telefono, rol_id, estado_id FROM usuarios WHERE rol_id IN (2, 3)";
    let params = [];

    if (rol_id) {
        query += " AND rol_id = ?";
        params.push(rol_id);
    } else {
        query += " AND (nombre LIKE ? OR apellido_paterno LIKE ? OR apellido_materno LIKE ? OR correo LIKE ?)";
        params = [`%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`, `%${busqueda}%`];
    }

    query += " ORDER BY FIELD(rol_id, 2, 3), nombre ASC";

    const [rows] = await pool.query(query, params);
    
    return rows;
}