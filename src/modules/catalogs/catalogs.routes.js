import { Router } from "express";
import * as catalogosController from "./catalogs.controller.js";

const router = Router();

router.get("/categorias", catalogosController.obtenerCategorias);
router.get(
  "/categorias/servicios",
  catalogosController.obtenerServiciosPorCategoria
);

export default router;
