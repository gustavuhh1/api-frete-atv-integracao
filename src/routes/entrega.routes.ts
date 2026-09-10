import { Router } from "express";
import {
  criarEntrega,
  listarEntregas,
  simularValores,
  concluirEntrega,
  cancelarEntrega,
} from "../controller/entrega.controller.ts";

const router = Router();

router.post("/simular", simularValores);   // simular antes do POST genérico
router.post("/", criarEntrega);
router.get("/", listarEntregas);
router.put("/:id/concluir", concluirEntrega);
router.put("/:id/cancelar", cancelarEntrega);

export default router;
