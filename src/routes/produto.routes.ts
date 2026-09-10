import { Router } from "express";
import {
  criar,
  listar,
  buscarPorId,
  atualizar,
  excluir,
} from "../controller/produto.controller.ts";

const router = Router();

/**
 * @openapi
 * /api/produtos:
 *   post:
 *     tags: [Produtos]
 *     summary: Cadastra um novo produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ProdutoInput"
 *     responses:
 *       201:
 *         description: Produto criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Produto"
 *       500:
 *         description: Erro ao criar produto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErro"
 */
router.post("/", criar);

/**
 * @openapi
 * /api/produtos:
 *   get:
 *     tags: [Produtos]
 *     summary: Lista todos os produtos
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Produto"
 *       500:
 *         description: Erro ao listar produtos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErro"
 */
router.get("/", listar);

/**
 * @openapi
 * /api/produtos/{id}:
 *   get:
 *     tags: [Produtos]
 *     summary: Busca um produto pelo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Produto"
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErro"
 *       500:
 *         description: Erro ao buscar produto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErro"
 */
router.get("/:id", buscarPorId);

/**
 * @openapi
 * /api/produtos/{id}:
 *   put:
 *     tags: [Produtos]
 *     summary: Atualiza um produto (campos parciais são aceitos)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ProdutoInput"
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Produto"
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErro"
 */
router.put("/:id", atualizar);

/**
 * @openapi
 * /api/produtos/{id}:
 *   delete:
 *     tags: [Produtos]
 *     summary: Exclui um produto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Produto excluído com sucesso (sem conteúdo)
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErro"
 */
router.delete("/:id", excluir);

export default router;
