import * as catalogosService from "./catalogs.service.js";

export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await catalogosService.listarCategorias();

    return res.status(200).json({
      codigo: 200,
      estatus: "success",
      mensaje: "Categorias obtenidas correctamente",
      datos: categorias,
      paginacion: null,
      errores: null,
    });
  } catch (error) {
    const codigoEstatus = error.codigo || 500;
    return res.status(codigoEstatus).json({
      codigo: codigoEstatus,
      estatus: "fail",
      mensaje: "Error al obtener categorias",
      datos: null,
      paginacion: null,
      errores: { general: error.message || "Ha ocurrido un error inesperado" },
    });
  }
};

export const obtenerServiciosPorCategoria = async (req, res) => {
  try {
    const categoriaId = Number(req.query.id);
    if (!Number.isInteger(categoriaId) || categoriaId <= 0) {
      return res.status(400).json({
        codigo: 400,
        estatus: "fail",
        mensaje: "ID de categoria invalido",
        datos: null,
        paginacion: null,
        errores: { id: "Debe ser un numero entero mayor a cero" },
      });
    }

    const servicios = await catalogosService.listarServiciosPorCategoria(
      categoriaId
    );

    return res.status(200).json({
      codigo: 200,
      estatus: "success",
      mensaje: "Servicios obtenidos correctamente",
      datos: servicios,
      paginacion: null,
      errores: null,
    });
  } catch (error) {
    const codigoEstatus = error.codigo || 500;
    return res.status(codigoEstatus).json({
      codigo: codigoEstatus,
      estatus: "fail",
      mensaje: "Error al obtener servicios",
      datos: null,
      paginacion: null,
      errores: { general: error.message || "Ha ocurrido un error inesperado" },
    });
  }
};
