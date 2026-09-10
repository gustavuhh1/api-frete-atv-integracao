export enum StatusEntrega {
  PENDENTE = "PENDENTE",
  EM_TRAFEGO = "EM_TRAFEGO",
  ENTREGUE = "ENTREGUE",
  CANCELADO = "CANCELADO",
}

export class Entrega {
  id: number;
  cepOrigem: string;
  cepDestino: string;
  rua: string;
  bairro: string;
  cidade: string;
  uf: string;
  estado: string;
  complemento: string;
  numero: string;
  tipoResidencia: string;
  distancia: number;
  taxaImposto: number;
  taxaFrete: number;
  produtoId: number;
  status: StatusEntrega;
  remetente: string;
  destinatario: string;

  constructor(
    id: number = 0,
    cepOrigem: string = "",
    cepDestino: string = "",
    rua: string = "",
    bairro: string = "",
    cidade: string = "",
    uf: string = "",
    estado: string = "",
    complemento: string = "",
    numero: string = "",
    tipoResidencia: string = "",
    distancia: number = 0,
    taxaImposto: number = 0,
    taxaFrete: number = 0,
    produtoId: number = 0,
    status: StatusEntrega = StatusEntrega.PENDENTE,
    remetente: string = "",
    destinatario: string = "",
  ) {
    this.id = id;
    this.cepOrigem = cepOrigem;
    this.cepDestino = cepDestino;
    this.rua = rua;
    this.bairro = bairro;
    this.cidade = cidade;
    this.uf = uf;
    this.estado = estado;
    this.complemento = complemento;
    this.numero = numero;
    this.tipoResidencia = tipoResidencia;
    this.distancia = distancia;
    this.taxaImposto = taxaImposto;
    this.taxaFrete = taxaFrete;
    this.produtoId = produtoId;
    this.status = status;
    this.remetente = remetente;
    this.destinatario = destinatario;
  }
}
