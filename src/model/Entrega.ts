interface Status {
  id: number;
  nome: string;
}

export class Entrega {
  id: number;
  cep: string;
  rua: string;
  complemento: string;
  numero: string;
  tipoResidencia: string;
  taxaImposto: number;
  taxaFrete: number;
  status: Status;
  remetente: string;
  destinatario: string;
  validado: boolean;

  constructor(
    id: number = 0,
    cep: string = "",
    rua: string = "",
    complemento: string = "",
    numero: string = "",
    tipoResidencia: string = "",
    taxaImposto: number = 0,
    taxaFrete: number = 0,
    status: Status = { id: 0, nome: "" },
    remetente: string = "",
    destinatario: string = "",
    validado: boolean = false,
  ) {
    this.id = id;
    this.cep = cep;
    this.rua = rua;
    this.complemento = complemento;
    this.numero = numero;
    this.tipoResidencia = tipoResidencia;
    this.taxaImposto = taxaImposto;
    this.taxaFrete = taxaFrete;
    this.status = status;
    this.remetente = remetente;
    this.destinatario = destinatario;
    this.validado = validado;
  }
}
