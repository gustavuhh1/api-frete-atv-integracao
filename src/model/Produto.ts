interface Categoria {
  id: number;
  nome: string;
}

export class Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  peso: number;
  importado: boolean;
  categoria: Categoria;

  constructor(
    id: number,
    nome: string,
    descricao: string,
    preco: number,
    quantidade: number,
    peso: number,
    importado: boolean,
    categoria: Categoria,
  ) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
    this.quantidade = quantidade;
    this.peso = peso;
    this.importado = importado;
    this.categoria = categoria;
  }

  
}
