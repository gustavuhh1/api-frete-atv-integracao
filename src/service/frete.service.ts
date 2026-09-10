import { prisma } from "../lib/prisma.ts";
import type { StatusEntrega } from "@prisma/client";
import { consultarEnderecoPorCep } from "./viacep.service.ts";

// ─── Cálculo de distância por região do Brasil ───────────────────────────────

const REGIOES: Record<string, string> = {
  AC: "Norte", AM: "Norte", AP: "Norte", PA: "Norte",
  RO: "Norte", RR: "Norte", TO: "Norte",
  AL: "Nordeste", BA: "Nordeste", CE: "Nordeste", MA: "Nordeste",
  PB: "Nordeste", PE: "Nordeste", PI: "Nordeste", RN: "Nordeste", SE: "Nordeste",
  DF: "Centro-Oeste", GO: "Centro-Oeste", MS: "Centro-Oeste", MT: "Centro-Oeste",
  ES: "Sudeste", MG: "Sudeste", RJ: "Sudeste", SP: "Sudeste",
  PR: "Sul", RS: "Sul", SC: "Sul",
};

function calcularDistanciaPorUF(ufOrigem: string, ufDestino: string): number {
  if (ufOrigem === ufDestino) return 80;                         // mesma UF

  const regiaoOrigem = REGIOES[ufOrigem];
  const regiaoDestino = REGIOES[ufDestino];

  if (regiaoOrigem === regiaoDestino) return 300;                // mesma região

  // Regiões opostas
  const pares = [`${regiaoOrigem}-${regiaoDestino}`, `${regiaoDestino}-${regiaoOrigem}`];
  if (pares.some(p => p.includes("Norte") && p.includes("Sul"))) return 2500;
  if (pares.some(p => p.includes("Norte") && p.includes("Sudeste"))) return 1800;
  if (pares.some(p => p.includes("Norte") && p.includes("Nordeste"))) return 900;

  return 800; // regiões distintas em geral
}

// ─── Cálculo de taxas ─────────────────────────────────────────────────────────

export interface ResultadoCalculo {
  taxaFrete: number;
  taxaImposto: number;
  distancia: number;
}

export function calcularValoresFrete(peso: number, distancia: number): ResultadoCalculo {
  // Imposto: R$5,00 base + R$2,50/kg acima de 50kg
  const IMPOSTO_BASE = 5.0;
  let taxaImposto = IMPOSTO_BASE;
  if (peso > 50) taxaImposto += (peso - 50) * 2.5;

  // Frete: grátis até 90km; acima → R$15 fixo + R$0,50/km extra
  let taxaFrete = 0;
  if (distancia > 90) taxaFrete = 15.0 + (distancia - 90) * 0.5;

  return {
    taxaFrete: Number(taxaFrete.toFixed(2)),
    taxaImposto: Number(taxaImposto.toFixed(2)),
    distancia: Number(distancia.toFixed(2)),
  };
}

// ─── Operações de Entrega ─────────────────────────────────────────────────────

export async function criarNovaEntrega(dados: {
  produtoId: number;
  cepOrigem: string;
  cepDestino: string;
  remetente: string;
  destinatario: string;
  numero: string;
  complemento: string;
  tipoResidencia: string;
}) {
  const { produtoId, cepOrigem, cepDestino, ...resto } = dados;

  // 1. Buscar o produto para obter o peso real
  const produto = await prisma.produto.findUnique({ where: { id: produtoId } });
  if (!produto) throw new Error("Produto não encontrado.");

  // 2. Buscar endereço de destino via ViaCEP
  const enderecoDestino = await consultarEnderecoPorCep(cepDestino);

  // 3. Buscar UF de origem via ViaCEP para calcular distância
  const enderecoOrigem = await consultarEnderecoPorCep(cepOrigem);

  // 4. Calcular distância e taxas baseadas em dados reais
  const distancia = calcularDistanciaPorUF(enderecoOrigem.uf, enderecoDestino.uf);
  const { taxaFrete, taxaImposto } = calcularValoresFrete(produto.peso, distancia);

  // 5. Criar entrega com todos os dados calculados
  return await prisma.entrega.create({
    data: {
      ...resto,
      cepOrigem,
      cepDestino: enderecoDestino.cep,
      rua: enderecoDestino.rua,
      bairro: enderecoDestino.bairro,
      cidade: enderecoDestino.cidade,
      uf: enderecoDestino.uf,
      estado: enderecoDestino.estado,
      distancia,
      taxaFrete,
      taxaImposto,
      produtoId,
    },
    include: { produto: true },
  });
}

export async function buscarTodasEntregas() {
  return await prisma.entrega.findMany({ include: { produto: true } });
}

export async function atualizarStatusEntrega(id: number, status: StatusEntrega) {
  return await prisma.entrega.update({
    where: { id },
    data: { status },
    include: { produto: true },
  });
}

export async function cancelarEntregaExistente(id: number) {
  const entrega = await prisma.entrega.findUnique({ where: { id } });
  if (!entrega) throw new Error("Entrega não encontrada.");

  if (entrega.status === "ENTREGUE" || entrega.status === "CANCELADO") {
    throw new Error(
      `Não é possível cancelar uma entrega com status "${entrega.status}".`,
    );
  }

  return await prisma.entrega.update({
    where: { id },
    data: { status: "CANCELADO" },
    include: { produto: true },
  });
}

export async function simularFrete(
  cepOrigem: string,
  cepDestino: string,
  peso: number,
): Promise<ResultadoCalculo> {
  const origem = await consultarEnderecoPorCep(cepOrigem);
  const destino = await consultarEnderecoPorCep(cepDestino);
  const distancia = calcularDistanciaPorUF(origem.uf, destino.uf);
  return calcularValoresFrete(peso, distancia);
}
