import type { NextFunction, Request, Response } from "express";

import { consultarEnderecoPorCep } from "../service/viacep.service.ts";

export async function consultarEndereco(
  req: Request<{ cep: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const endereco = await consultarEnderecoPorCep(req.params.cep);
    res.status(200).json(endereco);
  } catch (error) {
    next(error);
  }
}
