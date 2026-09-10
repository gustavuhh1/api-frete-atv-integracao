import type { Request, Response } from "express";
import { calcularValoresFrete, criarNovaEntrega, buscarTodasEntregas } from "../service/frete.service.ts";

export async function criarEntrega(req: Request, res: Response) {
  try {
    const entrega = await criarNovaEntrega(req.body);
    res.status(201).json(entrega);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar entrega" });
  }
}

export async function listarEntregas(req: Request, res: Response) {
  try {
    const entregas = await buscarTodasEntregas();
    res.status(200).json(entregas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar entregas" });
  }
}

export function simularValores(req: Request, res: Response) {
  try {
    const { peso, distancia } = req.body;
    if (peso === undefined || distancia === undefined) {
      res.status(400).json({ error: "Parâmetros 'peso' e 'distancia' são obrigatórios no body." });
      return;
    }

    const valores = calcularValoresFrete(Number(peso), Number(distancia));
    res.status(200).json(valores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao calcular valores de frete." });
  }
}
