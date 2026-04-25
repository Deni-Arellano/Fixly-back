import pool from "../../config/db.js";

export const obtenerCategorias = async () => {
  const [rows] = await pool.query(
    "SELECT id, nombre, descripcion FROM categorias ORDER BY id"
  );
  return rows;
};

export const obtenerServiciosPorCategoria = async (categoriaId) => {
  const [rows] = await pool.query(
    "SELECT id, categoria_id, nombre, descripcion FROM servicios WHERE categoria_id = ? ORDER BY id",
    [categoriaId]
  );
  return rows;
};
