import { Router } from "express";

import { consultarEndereco } from "../controller/endereco.controller.ts";

const enderecoRoutes = Router();

/**
 * @openapi
 * /api/enderecos/{cep}:
 *   get:
 *     tags: [Enderecos]
 *     summary: Consulta um endereço a partir do CEP (ViaCEP, com cache de 24h)
 *     parameters:
 *       - in: path
 *         name: cep
 *         required: true
 *         schema:
 *           type: string
 *           example: "01001000"
 *     responses:
 *       200:
 *         description: Endereço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Endereco"
 *       400:
 *         description: CEP inválido (deve conter exatamente 8 dígitos)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErroPt"
 *       404:
 *         description: CEP não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErroPt"
 *       502:
 *         description: Não foi possível consultar o ViaCEP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErroPt"
 *       504:
 *         description: O ViaCEP demorou muito para responder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErroErroPt"
 */
enderecoRoutes.get("/:cep", consultarEndereco);

export default enderecoRoutes;
