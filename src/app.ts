import express, { type Express, type Request, type Response } from "express";
import { ProdutoService } from "./service/produto.service.ts";

const app: Express = express();

// Middleware para interpretar requisições com JSON
app.use(express.json());

const produtoService = new ProdutoService();

// 1. Criar Produto
app.post("/produtos", (req: Request, res: Response) => {
  const { nome, descricao, preco, quantidade, peso, importado, categoria } = req.body;

  if (!nome || preco === undefined || quantidade === undefined) {
    return res.status(400).json({ mensagem: "Campos obrigatórios ausentes (nome, preco, quantidade)." });
  }

  const novoProduto = produtoService.criar({
    nome,
    descricao,
    preco,
    quantidade,
    peso,
    importado,
    categoria,
  });

  return res.status(201).json(novoProduto);
});

// 2. Listar todos os produtos
app.get("/produtos", (req: Request, res: Response) => {
  const produtos = produtoService.listarTodos();
  return res.status(200).json(produtos);
});

// 3. Buscar produto por ID
app.get("/produtos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const produto = produtoService.buscarPorId(id);

  if (!produto) {
    return res.status(404).json({ mensagem: "Produto não encontrado." });
  }

  return res.status(200).json(produto);
});

// 4. Alterar informações do produto
app.put("/produtos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const produtoAtualizado = produtoService.atualizar(id, req.body);

  if (!produtoAtualizado) {
    return res.status(404).json({ mensagem: "Produto não encontrado para atualização." });
  }

  return res.status(200).json(produtoAtualizado);
});

// 5. Excluir produto por ID
app.delete("/produtos/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deletado = produtoService.excluir(id);

  if (!deletado) {
    return res.status(404).json({ mensagem: "Produto não encontrado para remoção." });
  }

  return res.status(204).send();
});

export default app;