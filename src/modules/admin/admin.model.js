import pool from '../../config/db.js';

export const obtenerUsuarios = async () => {
    const [rows] = await pool.query(
        "SELECT id, nombre, apellido_paterno, apellido_materno, correo, telefono, rol_id, estado_id FROM usuarios WHERE rol_id IN (2, 3) ORDER BY FIELD(rol_id, 2, 3), nombre ASC"
    );

    return rows;
}