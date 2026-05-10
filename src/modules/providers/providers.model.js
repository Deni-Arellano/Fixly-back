import pool from "../../config/db.js";


export const obtenerPrestadoresPorCategoria = async (categoria_id) => {
    const [rows] = await pool.query(
        `SELECT usuarios.id,
                usuarios.nombre,
                usuarios.apellido_paterno,
                usuarios.apellido_materno,
                usuarios.foto_perfil,
                prestador.id AS id_prestador,
                prestador.descripcion
         FROM usuarios
         INNER JOIN prestador ON prestador.usuario_id = usuarios.id
         INNER JOIN prestador_servicios ON prestador_servicios.prestador_id = prestador.id
         INNER JOIN servicios ON servicios.id = prestador_servicios.servicio_id
         WHERE servicios.categoria_id = ? AND usuarios.estado_id = 1
         GROUP BY usuarios.id, prestador.id`,
        [categoria_id]
    );
    return rows;
}
