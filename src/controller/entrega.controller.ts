import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.ts";

export async function criarEntrega(req: Request, res: Response) {
  try {
    const { statusId, ...rest } = req.body;
    
    const entrega = await prisma.entrega.create({
      data: {
        ...rest,
        statusId: Number(statusId),
      },
      include: {
        status: true
      }
    });

    res.status(201).json(entrega);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar entrega" });
  }
}

export async function listarEntregas(req: Request, res: Response) {
  try {
    const entregas = await prisma.entrega.findMany({
      include: {
        status: true
      }
    });
    res.status(200).json(entregas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar entregas" });
  }
}
