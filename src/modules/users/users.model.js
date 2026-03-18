import pool from "../../config/db.js";

export const estadoDelUsuario = async (correo) => {
    const [rows] = await pool.query(
        "SELECT activo FROM usuarios WHERE correo = ? LIMIT 1", [correo]
    );
    return rows[0]
    
}

export const encontrarUsuarioPorEmail = async (email) => {
    const [rows] = await pool.query(
    "SELECT id_usuario, correo, contrasena_hash, verificado, fecha_registro, activo FROM usuarios WHERE correo = ? LIMIT 1",
    [email]
    );
    return rows[0];
}

export const encontrarUsuarioPorIdConRol = async (id) => {
    const [rows] = await pool.query(
        `SELECT usuarios.id_usuario, usuarios.correo, usuarios.activo, usuarios.verificado, 
                roles.id_rol, roles.nombre as rol_nombre
         FROM usuarios 
         INNER JOIN roles ON usuarios.id_rol = roles.id_rol 
         WHERE usuarios.id_usuario = ? LIMIT 1`,
        [id]
    );
    return rows[0];
}

export const verificarCorreoTelefonoRFCRepetido = async (datosUsuario) => {
    const [rows] = await pool.query(
        `SELECT usuarios.correo, datos_personales.telefono, datos_personales.rfc
        FROM  usuarios
        INNER JOIN datos_personales 
            ON  datos_personales.id_usuario = usuarios.id_usuario
            WHERE usuarios.correo = ?
                OR datos_personales.telefono = ?
                OR datos_personales.rfc = ? 
        LIMIT 1`,[datosUsuario.usuario.correo, datosUsuario.datos_personales.telefono, datosUsuario.datos_personales.rfc]
    );

    return rows[0];
}


export const verificarTelefonoRFCRepetido = async (id,datos) => {
    let campo = null;
    if (datos.telefono) {
        const [rows] = await pool.query(
            `SELECT 1 FROM datos_personales WHERE telefono = ? AND id_usuario != ? LIMIT 1`,
            [datos.telefono, id]
        );
        if (rows.length > 0) campo = 'teléfono';
    }
    if (!campo && datos.rfc) {
        const [rows] = await pool.query(
            `SELECT 1 FROM datos_personales WHERE rfc = ? AND id_usuario != ? LIMIT 1`,
            [datos.rfc, id]
        );
        if (rows.length > 0) campo = 'RFC';
    }
    return campo ? { campo_repetido: campo } : null;
};

export const verificarCorreoTelefonoRFCRepetidoEdit = async (id, datos) => {
    let campo = null;
    

    if (datos.usuario?.correo) {
        const [rows] = await pool.query(
            `SELECT 1 FROM usuarios WHERE correo = ? AND id_usuario != ? LIMIT 1`,
            [datos.usuario.correo, id]
        );
        if (rows.length > 0) campo = 'correo';
    }
    if (!campo && datos.datos_personales?.telefono) {
        const [rows] = await pool.query(
            `SELECT 1 FROM datos_personales WHERE telefono = ? AND id_usuario != ? LIMIT 1`,
            [datos.datos_personales.telefono, id]
        );
        if (rows.length > 0) campo = 'teléfono';
    }
    if (!campo && datos.datos_personales?.rfc) {
        const [rows] = await pool.query(
            `SELECT 1 FROM datos_personales WHERE rfc = ? AND id_usuario != ? LIMIT 1`,
            [datos.datos_personales.rfc, id]
        );
        if (rows.length > 0) campo = 'RFC';
    }
    return campo ? { campo_repetido: campo } : null;
};

export const verificarTelefonoRepetido = async (telefono, id_usuario) => {
    const [rows] = await pool.query(
        `SELECT telefono
        FROM datos_personales
        WHERE telefono = ?
          AND id_usuario != ?
        LIMIT 1`, [telefono, id_usuario]
            );

    return rows[0];
    
}

export const agregarUsuario = async (datosUsuario) => {
    const conexion = await pool.getConnection();
    try{
        await conexion.beginTransaction();

        const [resultadoUsuario] = await conexion.query(
            `INSERT INTO usuarios(correo, contrasena_hash, fecha_registro, id_rol)
            VALUES(?, ?, NOW(), ?)`,
            [
                datosUsuario.usuario.correo,
                datosUsuario.usuario.contrasena,
                datosUsuario.usuario.id_rol
            ]
        );

        const idUsuario = resultadoUsuario.insertId;

        await conexion.query(
            `INSERT INTO datos_personales(id_usuario, nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento, rfc)
            VALUES(?, ?, ?, ?, ?, ?, ?)`,
            [
                idUsuario,
                datosUsuario.datos_personales.nombre,
                datosUsuario.datos_personales.primer_apellido,
                datosUsuario.datos_personales.segundo_apellido,
                datosUsuario.datos_personales.telefono,
                datosUsuario.datos_personales.fecha_nacimiento,
                datosUsuario.datos_personales.rfc
            ]
        );

        await conexion.commit();

        
        return {
            id_usuario: idUsuario,
            correo: datosUsuario.usuario.correo,
            nombre: datosUsuario.datos_personales.nombre
        };

    } catch(error){
        await conexion.rollback();
        console.log(error)
        throw error;

    } finally {
        conexion.release();
    }
    
    
}

export const editarTablaDatosPersonalesPorID = async (conexion, idUsuario, datosAEditar) => {
    const campos = Object.keys(datosAEditar);
    if (campos.length === 0) return 0;
    const setClause = campos.map(campo => `${campo} = ?`).join(', ');
    const valores = campos.map(campo => datosAEditar[campo]);
    const sql = `UPDATE datos_personales SET ${setClause} WHERE id_usuario = ?`;
    //console.log(sql)
    const [result] = await conexion.query(sql, [...valores, idUsuario]);
    return result.affectedRows;
};


export const editarTablaUsuariosPorID = async (conexion, idUsuario, datosAEditar) => {
    const campos = Object.keys(datosAEditar);
    if (campos.length === 0) return 0;
    const setClause = campos.map(campo => `${campo} = ?`).join(", ");
    const valores = campos.map(campo => datosAEditar[campo]);
    const sql = `UPDATE usuarios SET ${setClause} WHERE id_usuario = ?`;
    //console.log('Datos model')
    console.log(sql, idUsuario,valores)
    const [result] = await conexion.query(sql, [...valores, idUsuario]);
    return result.affectedRows;
    
}


export const obtenerRolUsuario = async (idUsuario) =>{
        const [rows] = await pool.query(
        `SELECT roles.id_rol, roles.nombre as rol_nombre
         FROM usuarios 
         JOIN roles ON usuarios.id_rol = roles.id_rol 
         WHERE usuarios.id_usuario = ? LIMIT 1`,
        [idUsuario]
    );
    return rows[0];
}

export const cambiarEstadoUsuario = async (idUsuario, estado) => {
    const [rows] = await pool.query(
        `UPDATE usuarios
        SET activo = ?
        WHERE id_usuario = ?`, [estado,idUsuario]
    );

    return rows.affectedRows;
    
}

export const obtenerUsuarioPorId = async (idUsuario) => {
    const [rows] = await pool.query(
        `SELECT usuarios.correo, usuarios.verificado,usuarios.id_rol,  roles.nombre AS rol_nombre,  datos_personales.nombre, datos_personales.primer_apellido, datos_personales.segundo_apellido, datos_personales.telefono, datos_personales.fecha_nacimiento, datos_personales.rfc 
        FROM usuarios
        INNER JOIN datos_personales 
            ON usuarios.id_usuario = datos_personales.id_usuario
        INNER JOIN roles 
            ON usuarios.id_rol = roles.id_rol
        WHERE usuarios.id_usuario = ? LIMIT 1`, [idUsuario]);

    return rows[0];    
}

export const obtenerUsuarios = async (filtro) => {
    let sql = `SELECT 
        usuarios.id_usuario,
        CONCAT(datos_personales.nombre, ' ', datos_personales.primer_apellido, 
               IFNULL(CONCAT(' ', datos_personales.segundo_apellido), '')) AS nombre_completo,
        usuarios.correo,
        usuarios.activo,
        roles.nombre AS rol_nombre,
        usuarios.id_rol
    FROM usuarios
    INNER JOIN datos_personales ON usuarios.id_usuario = datos_personales.id_usuario
    INNER JOIN roles ON usuarios.id_rol = roles.id_rol`;

    let valores = [];

    // Caso 1 superadministrador sin filtro
    if (filtro === null) {
        // no agregamos WHERE
    }

    // Caso 2: administrador sin tipo (array de roles permitidos)
    else if (Array.isArray(filtro)) {
        sql += ` WHERE usuarios.id_rol IN (${filtro.map(() => '?').join(',')})`;
        valores = filtro;
    }

    // Caso 3: filtro único
    else {
        sql += ` WHERE usuarios.id_rol = ?`;
        valores = [filtro];
    }
    
    sql += ` ORDER BY datos_personales.nombre, datos_personales.primer_apellido`;

    const [rows] = await pool.query(sql, valores);

    return rows;

}