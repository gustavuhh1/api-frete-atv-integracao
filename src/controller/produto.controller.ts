import type { Request, Response } from "express";
import ProdutoService from "../service/produto.service.js";

export class ProdutoController {
  private produtoService: ProdutoService;

  constructor() {
    this.produtoService = new ProdutoService();
  }

  // POST /produtos
  public criar = (req: Request, res: Response): Response => {
    try {
      const { nome, descricao, preco, quantidade, peso, importado, categoria } = req.body;

      if (!nome || preco === undefined || quantidade === undefined) {
        return res.status(400).json({ mensagem: "Campos obrigatórios ausentes." });
      }

      const novoProduto = this.produtoService.criar({
        nome,
        descricao,
        preco: Number(preco),
        quantidade: Number(quantidade),
        peso: Number(peso),
        importado: Boolean(importado),
        categoria
      });

      return res.status(201).json(novoProduto);
    } catch (erro) {
      return res.status(500).json({ mensagem: "Erro ao criar produto." });
    }
  };

  // GET /produtos
  public listarTodos = (_req: Request, res: Response): Response => {
    const produtos = this.produtoService.listarTodos();
    return res.status(200).json(produtos);
  };

  // GET /produtos/:id
  public buscarPorId = (req: Request, res: Response): Response => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "ID inválido." });
    }

    const produto = this.produtoService.buscarPorId(id);

    if (!produto) {
      return res.status(404).json({ mensagem: "Produto não encontrado." });
    }

    return res.status(200).json(produto);
  };

  // PUT /produtos/:id
  public atualizar = (req: Request, res: Response): Response => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "ID inválido." });
    }

    const produtoAtualizado = this.produtoService.atualizar(id, req.body);

    if (!produtoAtualizado) {
      return res.status(404).json({ mensagem: "Produto não encontrado para atualização." });
    }

    return res.status(200).json(produtoAtualizado);
  };

  // DELETE /produtos/:id
  public excluir = (req: Request, res: Response): Response => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ mensagem: "ID inválido." });
    }

    const excluido = this.produtoService.excluir(id);

    if (!excluido) {
      return res.status(404).json({ mensagem: "Produto não encontrado para exclusão." });
    }

    return res.status(200).json({ mensagem: "Produto excluído com sucesso." });
  };
}