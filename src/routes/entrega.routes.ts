import { Router } from "express";
import {
  criarEntrega,
  listarEntregas,
  simularValores,
  concluirEntrega,
  cancelarEntrega,
} from "../controller/entrega.controller.ts";

const router = Router();

/**
 * @openapi
 * /api/entregas/simular:
 *   post:
 *     tags: [Entregas]
 *     summary: Simula distância, imposto e frete sem criar uma entrega
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SimularFreteInput"
 *     responses:
 *       200:
 *         description: Valores simulados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SimularFreteResultado"
 *       400:
 *         description: Parâmetros obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErro"
 *       500:
 *         description: Erro ao simular frete (ex. CEP inválido ou ViaCEP indisponível)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErro"
 */
router.post("/simular", simularValores);   // simular antes do POST genérico

/**
 * @openapi
 * /api/entregas:
 *   post:
 *     tags: [Entregas]
 *     summary: Cria uma nova entrega (busca o endereço de destino via ViaCEP e calcula frete/imposto)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/EntregaInput"
 *     responses:
 *       201:
 *         description: Entrega criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Entrega"
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErro"
 *       500:
 *         description: Erro ao criar entrega
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErro"
 */
router.post("/", criarEntrega);

/**
 * @openapi
 * /api/entregas:
 *   get:
 *     tags: [Entregas]
 *     summary: Lista todas as entregas (com o produto associado)
 *     responses:
 *       200:
 *         description: Lista de entregas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Entrega"
 *       500:
 *         description: Erro ao listar entregas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErro"
 */
router.get("/", listarEntregas);

/**
 * @openapi
 * /api/entregas/{id}/concluir:
 *   put:
 *     tags: [Entregas]
 *     summary: Marca a entrega como ENTREGUE
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entrega atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Entrega"
 *       404:
 *         description: Entrega não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErro"
 */
router.put("/:id/concluir", concluirEntrega);

/**
 * @openapi
 * /api/entregas/{id}/cancelar:
 *   put:
 *     tags: [Entregas]
 *     summary: Cancela uma entrega (não permitido se já ENTREGUE ou CANCELADO)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entrega cancelada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Entrega"
 *       404:
 *         description: Entrega não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErro"
 *       409:
 *         description: Entrega já está ENTREGUE ou CANCELADO
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErro"
 */
router.put("/:id/cancelar", cancelarEntrega);

export default router;
