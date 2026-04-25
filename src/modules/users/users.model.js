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

export const obtenerUsuarioPorId = async (idUsuario) => {
    const [rows] = await pool.query(
    "SELECT id, nombre, apellido_paterno, apellido_materno, correo, telefono, foto_perfil, rol_id, estado_id, created_at FROM usuarios WHERE id = ? LIMIT 1",
    [idUsuario]
    );
    return rows[0];    
}

export const obtenerPrestadorPorId = async (idUsuario) => {
    const [rows] = await pool.query(
    `SELECT usuarios.id,
            usuarios.nombre,
            usuarios.apellido_paterno,
            usuarios.apellido_materno,
            usuarios.correo,
            usuarios.telefono,
            usuarios.foto_perfil,
            usuarios.rol_id,
            usuarios.estado_id,
            usuarios.created_at,
            prestador.id AS id_prestador,
            prestador.descripcion,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', servicios.id,
                    'nombre', servicios.nombre,
                    'descripcion', servicios.descripcion,
                    'categoria_id', servicios.categoria_id
                )
            ) AS servicios
     FROM usuarios
     INNER JOIN prestador ON prestador.usuario_id = usuarios.id
     LEFT JOIN prestador_servicios ON prestador_servicios.prestador_id = prestador.id
     LEFT JOIN servicios ON servicios.id = prestador_servicios.servicio_id
     WHERE usuarios.id = ?
     GROUP BY usuarios.id, prestador.id`,
    [idUsuario]
    );
    return rows[0];    
}

export const obtenerPromedioYComentarios = async (idPrestador) => {
  const [[promedioRow]] = await pool.query(
    "SELECT AVG(estrellas) AS promedio FROM calificaciones WHERE prestador_id = ?",
    [idPrestador]
  );

  const [comentarios] = await pool.query(
    "SELECT estrellas, comentario FROM calificaciones WHERE prestador_id = ?",
    [idPrestador]
  );

  return {
    promedio: promedioRow?.promedio || 0,
    comentarios
  };
};

