import { prisma } from "../lib/prisma.ts";

// Criar produto
export async function criarProduto(dados: {
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  peso: number;
  importado: boolean;
  categoria: string;
}) {
  return await prisma.produto.create({ data: dados });
}

// Listar todos os produtos
export async function listarProdutos() {
  return await prisma.produto.findMany();
}

// Buscar produto por ID
export async function buscarProdutoPorId(id: number) {
  return await prisma.produto.findUnique({ where: { id } });
}

// Atualizar produto
export async function atualizarProduto(
  id: number,
  dados: Partial<{
    nome: string;
    descricao: string;
    preco: number;
    quantidade: number;
    peso: number;
    importado: boolean;
    categoria: string;
  }>,
) {
  return await prisma.produto.update({ where: { id }, data: dados });
}

// Excluir produto
export async function excluirProduto(id: number) {
  return await prisma.produto.delete({ where: { id } });
}