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


export const agregarUsuario= async(datosCliente) => {
    const [result] = await pool.query(
    `INSERT INTO usuarios (
        nombre, apellido_paterno, apellido_materno, correo, password, telefono, rol_id, estado_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [datosCliente.nombre, datosCliente.apellido_paterno, datosCliente.apellido_materno, datosCliente.correo, datosCliente.password, datosCliente.telefono, datosCliente.rol_id, datosCliente.estado_id]
    );

    return { id: result.insertId };
}

export const agregarUsuarioConConn = async (conn, datosUsuario) => {
  const [result] = await conn.query(
    `INSERT INTO usuarios (nombre, apellido_paterno, apellido_materno, correo, password, telefono, rol_id, estado_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [datosUsuario.nombre, datosUsuario.apellido_paterno, datosUsuario.apellido_materno, datosUsuario.correo, datosUsuario.password, datosUsuario.telefono, datosUsuario.rol_id, datosUsuario.estado_id]
  );
  return result.insertId;
};


export const insertarPrestador= async(conn, datosPrestador) => {
    const [result] = await conn.query(
    `INSERT INTO prestador(
        usuario_id, descripcion)
        VALUES (?, ?)`, 
        [datosPrestador.usuario_id, datosPrestador.descripcion]
    );

    return result.insertId;
}


export const insertarServicios = async (conn, { prestador_id, servicios }) => {
  if (!Array.isArray(servicios) || servicios.length === 0) {
    return { affectedRows: 0 };
  }

  const valores = servicios.map(() => "(?, ?)").join(", ");
  const params = servicios.flatMap((servicio_id) => [prestador_id, servicio_id]);

  const [result] = await conn.query(
    `INSERT INTO prestador_servicios (prestador_id, servicio_id) VALUES ${valores}`,
    params
  );

  return result;
};
