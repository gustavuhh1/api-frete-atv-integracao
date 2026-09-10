import { Router } from "express";

import { consultarEndereco } from "../controller/endereco.controller.ts";

const enderecoRoutes = Router();

enderecoRoutes.get("/:cep", consultarEndereco);

export default enderecoRoutes;
