import express from "express";
import { ProdutoController } from "./controller/produto.controller.js";

const app = express();

app.use(express.json());

const produtoController = new ProdutoController();

app.post("/produtos", produtoController.criar);
app.get("/produtos", produtoController.listarTodos);
app.get("/produtos/:id", produtoController.buscarPorId);
app.put("/produtos/:id", produtoController.atualizar);
app.delete("/produtos/:id", produtoController.excluir);

export default app;