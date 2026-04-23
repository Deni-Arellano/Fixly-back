import pool from "../../config/db.js";

export const estadoDelUsuario = async (correo) => {
    const [rows] = await pool.query(
        "SELECT estado_id FROM usuarios WHERE correo = ? LIMIT 1", [correo]
    );
    return rows[0]
    
}

export const encontrarUsuarioPorEmail = async (email) => {
    const [rows] = await pool.query(
    "SELECT id, nombre, apellido_paterno, apellido_materno, correo, password, telefono, foto_perfil, rol_id, estado_id, created_at FROM usuarios WHERE correo = ? LIMIT 1",
    [email]
    );
    return rows[0];
}

export const encontrarUsuarioPorIdConRol = async (id) => {
    const [rows] = await pool.query(
        `SELECT usuarios.id as id_usuario, usuarios.correo, usuarios.estado_id,
                roles.id as id_rol, roles.nombre as rol_nombre
         FROM usuarios 
         INNER JOIN roles ON usuarios.rol_id = roles.id
         WHERE usuarios.id = ? LIMIT 1`,
        [id]
    );
    return rows[0];
}


export const verificarTelefonoRepetido = async (telefono, id_usuario) => {
    const [rows] = await pool.query(
        `SELECT telefono
        FROM usuarios
        WHERE telefono = ?
          AND id != ?
        LIMIT 1`, [telefono, id_usuario]
            );

    return rows[0];
    
}

export const verificarCorreoRepetido = async (correo) => {
    const [rows] = await pool.query(
        `SELECT correo
        FROM usuarios
        WHERE correo = ?
        LIMIT 1`, [correo]
            );

    return rows[0];
    
}

export const agregarCliente= async(datosCliente) => {
    const [rows] = await pool.query(
    `INSERT INTO usuarios (
        nombre, apellido_paterno, apellido_materno, correo, password, telefono, rol_id, estado_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [datosCliente.nombre, datosCliente. apellido_paterno, datosCliente.apellido_materno, datosCliente.correo, datosCliente.password, datosCliente.telefono, datosCliente.rol_id, datosCliente.estado_id]
    );

    return rows[0];
}

