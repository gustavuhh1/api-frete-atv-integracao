import { prisma } from "../lib/prisma.ts";
import type { StatusEntrega } from "@prisma/client";

export interface ResultadoCalculo {
  taxaFrete: number;
  taxaImposto: number;
}

export function calcularValoresFrete(
  peso: number,
  distancia: number,
): ResultadoCalculo {
  let taxaImposto = 0;
  let taxaFrete = 0;

  // Imposto: Base R$5,00. Acima de 50kg → +R$2,50 por kg extra
  const IMPOSTO_BASE = 5.0;
  const PESO_LIMITE = 50;
  const TAXA_POR_KG_EXTRA = 2.5;

  taxaImposto += IMPOSTO_BASE;
  if (peso > PESO_LIMITE) {
    const kgExtra = peso - PESO_LIMITE;
    taxaImposto += kgExtra * TAXA_POR_KG_EXTRA;
  }

  // Frete: Grátis até 90km. Acima → R$15,00 fixo + R$0,50 por km extra
  const DISTANCIA_LIMITE = 90;
  const FRETE_BASE_DISTANTE = 15.0;
  const TAXA_POR_KM_EXTRA = 0.5;

  if (distancia > DISTANCIA_LIMITE) {
    const kmExtra = distancia - DISTANCIA_LIMITE;
    taxaFrete = FRETE_BASE_DISTANTE + kmExtra * TAXA_POR_KM_EXTRA;
  } else {
    taxaFrete = 0;
  }

  return {
    taxaFrete: Number(taxaFrete.toFixed(2)),
    taxaImposto: Number(taxaImposto.toFixed(2)),
  };
}

export async function criarNovaEntrega(dados: any) {
  // statusId foi removido — status agora é Enum direto na tabela Entrega
  const { peso, distancia, ...rest } = dados;

  const { taxaFrete, taxaImposto } = calcularValoresFrete(
    Number(peso || 0),
    Number(distancia || 0),
  );

  return await prisma.entrega.create({
    data: {
      ...rest,
      peso: Number(peso || 0),
      distancia: Number(distancia || 0),
      taxaFrete,
      taxaImposto,
      // status default PENDENTE definido no schema, não precisa enviar
    },
  });
}

export async function buscarTodasEntregas() {
  return await prisma.entrega.findMany();
}

export async function atualizarStatusEntrega(id: number, status: StatusEntrega) {
  return await prisma.entrega.update({
    where: { id },
    data: { status },
  });
}
