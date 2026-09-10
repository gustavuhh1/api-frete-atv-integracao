import type { Request, Response } from "express";
import {
  criarProduto,
  listarProdutos,
  buscarProdutoPorId,
  atualizarProduto,
  excluirProduto,
} from "../service/produto.service.ts";

// POST /api/produtos
export async function criar(req: Request, res: Response) {
  try {
    const produto = await criarProduto(req.body);
    res.status(201).json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar produto." });
  }
}

// GET /api/produtos
export async function listar(req: Request, res: Response) {
  try {
    const produtos = await listarProdutos();
    res.status(200).json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar produtos." });
  }
}

// GET /api/produtos/:id
export async function buscarPorId(req: Request, res: Response) {
  try {
    const produto = await buscarProdutoPorId(Number(req.params.id));
    if (!produto) {
      res.status(404).json({ error: "Produto não encontrado." });
      return;
    }
    res.status(200).json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produto." });
  }
}

// PUT /api/produtos/:id
export async function atualizar(req: Request, res: Response) {
  try {
    const produto = await atualizarProduto(Number(req.params.id), req.body);
    res.status(200).json(produto);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Produto não encontrado." });
  }
}

// DELETE /api/produtos/:id
export async function excluir(req: Request, res: Response) {
  try {
    await excluirProduto(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Produto não encontrado." });
  }
}