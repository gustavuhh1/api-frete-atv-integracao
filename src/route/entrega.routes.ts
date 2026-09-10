import { Router } from "express";
import { criarEntrega, listarEntregas } from "../controller/entrega.controller.ts";

const router = Router();

router.post("/", criarEntrega);
router.get("/", listarEntregas);

export default router;
