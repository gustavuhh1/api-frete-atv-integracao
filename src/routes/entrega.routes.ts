import { Router } from "express";
import {
  criarEntrega,
  listarEntregas,
  simularValores,
  concluirEntrega,
} from "../controller/entrega.controller.ts";

const router = Router();

router.post("/simular", simularValores);
router.post("/", criarEntrega);
router.get("/", listarEntregas);
router.put("/:id/concluir", concluirEntrega);

export default router;
