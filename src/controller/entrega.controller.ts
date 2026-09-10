import type { Request, Response } from "express";
import {
  criarNovaEntrega,
  buscarTodasEntregas,
  atualizarStatusEntrega,
  simularFrete,
  cancelarEntregaExistente,
} from "../service/frete.service.ts";

// POST /api/entregas
// Body: { produtoId, cepOrigem, cepDestino, remetente, destinatario, numero, complemento, tipoResidencia }
export async function criarEntrega(req: Request, res: Response) {
  try {
    const entrega = await criarNovaEntrega(req.body);
    res.status(201).json(entrega);
  } catch (error: any) {
    console.error(error);
    const isProdutoNotFound = error?.message === "Produto não encontrado.";
    res.status(isProdutoNotFound ? 404 : 500).json({ error: error?.message ?? "Erro ao criar entrega." });
  }
}

// GET /api/entregas
export async function listarEntregas(req: Request, res: Response) {
  try {
    const entregas = await buscarTodasEntregas();
    res.status(200).json(entregas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar entregas." });
  }
}

// PUT /api/entregas/:id/concluir
export async function concluirEntrega(req: Request, res: Response) {
  try {
    const entrega = await atualizarStatusEntrega(Number(req.params.id), "ENTREGUE");
    res.status(200).json(entrega);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Entrega não encontrada." });
  }
}

// PUT /api/entregas/:id/cancelar
export async function cancelarEntrega(req: Request, res: Response) {
  try {
    const entrega = await cancelarEntregaExistente(Number(req.params.id));
    res.status(200).json(entrega);
  } catch (error: any) {
    console.error(error);
    const isNotFound = error?.message === "Entrega não encontrada.";
    const isInvalid = error?.message?.startsWith("Não é possível");
    if (isNotFound) res.status(404).json({ error: error.message });
    else if (isInvalid) res.status(409).json({ error: error.message });
    else res.status(500).json({ error: "Erro ao cancelar entrega." });
  }
}

// POST /api/entregas/simular
// Body: { cepOrigem, cepDestino, peso }
export async function simularValores(req: Request, res: Response) {
  try {
    const { cepOrigem, cepDestino, peso } = req.body;
    if (!cepOrigem || !cepDestino || peso === undefined) {
      res.status(400).json({ error: "Parâmetros obrigatórios: cepOrigem, cepDestino, peso." });
      return;
    }
    const resultado = await simularFrete(cepOrigem, cepDestino, Number(peso));
    res.status(200).json(resultado);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error?.message ?? "Erro ao simular frete." });
  }
}
