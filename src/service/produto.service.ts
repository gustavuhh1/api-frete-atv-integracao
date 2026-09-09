import { Produto } from "../model/Produto.ts";

export class ProdutoService {
  private produtos: Produto[] = [];
  private proximoId: number = 1;

  // Criar um novo produto
  public criar(dados: Omit<Produto, "id">): Produto {
    const novoProduto = new Produto(
      this.proximoId++,
      dados.nome,
      dados.descricao,
      dados.preco,
      dados.quantidade,
      dados.peso,
      dados.importado,
      dados.categoria
    );
    this.produtos.push(novoProduto);
    return novoProduto;
  }

  // Listar todos os produtos
  public listarTodos(): Produto[] {
    return this.produtos;
  }

  // Buscar produto por ID
  public buscarPorId(id: number): Produto | undefined {
    return this.produtos.find((p) => p.id === id);
  }

  // Alterar informações de um produto
  public atualizar(id: number, dados: Partial<Omit<Produto, "id">>): Produto | null {
    const produto = this.buscarPorId(id);
    if (!produto) return null;

    if (dados.nome !== undefined) produto.nome = dados.nome;
    if (dados.descricao !== undefined) produto.descricao = dados.descricao;
    if (dados.preco !== undefined) produto.preco = dados.preco;
    if (dados.quantidade !== undefined) produto.quantidade = dados.quantidade;
    if (dados.peso !== undefined) produto.peso = dados.peso;
    if (dados.importado !== undefined) produto.importado = dados.importado;
    if (dados.categoria !== undefined) produto.categoria = dados.categoria;

    return produto;
  }

  // Excluir um produto por ID
  public excluir(id: number): boolean {
    const index = this.produtos.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.produtos.splice(index, 1);
    return true;
  }
}