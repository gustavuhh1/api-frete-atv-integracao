import { prisma } from "../lib/prisma.ts";

export interface ResultadoCalculo {
  taxaFrete: number;
  taxaImposto: number;
}

export function calcularValoresFrete(peso: number, distancia: number): ResultadoCalculo {
  let taxaImposto = 0;
  let taxaFrete = 0;

  // Lógica fictícia para Imposto (exemplo: Base 5.00, se passar de 50kg, cobra 2.50 por kg adicional)
  const IMPOSTO_BASE = 5.0;
  const PESO_LIMITE = 50;
  const TAXA_POR_KG_EXTRA = 2.5;

  taxaImposto += IMPOSTO_BASE;
  if (peso > PESO_LIMITE) {
    const kgExtra = peso - PESO_LIMITE;
    taxaImposto += (kgExtra * TAXA_POR_KG_EXTRA);
  }

  // Lógica fictícia para Frete (exemplo: Grátis até 90km, passou disso cobra 15.00 + 0.50 por km adicional)
  const DISTANCIA_LIMITE = 90;
  const FRETE_BASE_DISTANTE = 15.0;
  const TAXA_POR_KM_EXTRA = 0.5;

  if (distancia > DISTANCIA_LIMITE) {
    const kmExtra = distancia - DISTANCIA_LIMITE;
    taxaFrete = FRETE_BASE_DISTANTE + (kmExtra * TAXA_POR_KM_EXTRA);
  } else {
    // Para distâncias menores ou iguais a 90km, o frete é grátis (0)
    taxaFrete = 0;
  }

  // Retornando os valores com apenas 2 casas decimais
  return {
    taxaFrete: Number(taxaFrete.toFixed(2)),
    taxaImposto: Number(taxaImposto.toFixed(2))
  };
}

export async function criarNovaEntrega(dados: any) {
  const { statusId, peso, distancia, ...rest } = dados;
  
  const { taxaFrete, taxaImposto } = calcularValoresFrete(Number(peso || 0), Number(distancia || 0));
  
  return await prisma.entrega.create({
    data: {
      ...rest,
      peso: Number(peso || 0),
      distancia: Number(distancia || 0),
      taxaFrete,
      taxaImposto,
      statusId: Number(statusId),
    },
    include: {
      status: true
    }
  });
}

export async function buscarTodasEntregas() {
  return await prisma.entrega.findMany({
    include: {
      status: true
    }
  });
}
