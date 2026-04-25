import * as catalogosModel from "./catalogs.model.js";

export const listarCategorias = async () => {
  const categorias = await catalogosModel.obtenerCategorias();
  if (!categorias || categorias.length === 0) {
    const error = new Error("No se encontraron categorias");
    error.codigo = 404;
    throw error;
  }
  return categorias;
};

export const listarServiciosPorCategoria = async (categoriaId) => {
  const servicios = await catalogosModel.obtenerServiciosPorCategoria(categoriaId);
  if (!servicios || servicios.length === 0) {
    const error = new Error("No se encontraron servicios para la categoria");
    error.codigo = 404;
    throw error;
  }
  return servicios;
};
