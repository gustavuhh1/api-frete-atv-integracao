import { Router } from "express";
import { criarEntrega, listarEntregas, simularValores } from "../controller/entrega.controller.ts";

const router = Router();

router.post("/simular", simularValores);
router.post("/", criarEntrega);
router.get("/", listarEntregas);

export default router;
