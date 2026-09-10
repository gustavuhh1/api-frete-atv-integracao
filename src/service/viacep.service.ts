import type { Endereco } from "../model/Endereco.ts";

interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  estado?: string;
  erro?: boolean | "true";
}

interface EnderecoEmCache {
  endereco: Endereco;
  expiraEm: number;
}

const TEMPO_DE_CACHE_MS = 24 * 60 * 60 * 1000;
const enderecosEmCache = new Map<string, EnderecoEmCache>();

export class CepInvalidoError extends Error {
  constructor() {
    super("O CEP deve conter exatamente 8 dígitos");
    this.name = "CepInvalidoError";
  }
}

export class CepNaoEncontradoError extends Error {
  constructor() {
    super("CEP não encontrado");
    this.name = "CepNaoEncontradoError";
  }
}

export class ViaCepIndisponivelError extends Error {
  readonly statusCode: number;

  constructor(
    message = "Não foi possível consultar o ViaCEP",
    statusCode = 502,
  ) {
    super(message);
    this.name = "ViaCepIndisponivelError";
    this.statusCode = statusCode;
  }
}

function normalizarCep(cep: string): string {
  const cepInformado = cep.trim();

  if (!/^\d{5}-?\d{3}$/.test(cepInformado)) {
    throw new CepInvalidoError();
  }

  return cepInformado.replace("-", "");
}

export async function consultarEnderecoPorCep(cep: string): Promise<Endereco> {
  const cepNormalizado = normalizarCep(cep);
  const enderecoEmCache = enderecosEmCache.get(cepNormalizado);

  if (enderecoEmCache && enderecoEmCache.expiraEm > Date.now()) {
    return { ...enderecoEmCache.endereco };
  }

  if (enderecoEmCache) {
    enderecosEmCache.delete(cepNormalizado);
  }

  let response: Response;

  try {
    response = await fetch(
      `https://viacep.com.br/ws/${cepNormalizado}/json/`,
      { signal: AbortSignal.timeout(5000) },
    );
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new ViaCepIndisponivelError(
        "O ViaCEP demorou muito para responder",
        504,
      );
    }

    throw new ViaCepIndisponivelError();
  }

  if (!response.ok) {
    throw new ViaCepIndisponivelError();
  }

  let enderecoViaCep: ViaCepResponse;

  try {
    enderecoViaCep = (await response.json()) as ViaCepResponse;
  } catch {
    throw new ViaCepIndisponivelError("O ViaCEP retornou uma resposta inválida");
  }

  if (enderecoViaCep.erro === true || enderecoViaCep.erro === "true") {
    throw new CepNaoEncontradoError();
  }

  if (!enderecoViaCep.cep || !enderecoViaCep.localidade || !enderecoViaCep.uf) {
    throw new ViaCepIndisponivelError("O ViaCEP retornou uma resposta incompleta");
  }

  const endereco: Endereco = {
    cep: enderecoViaCep.cep,
    rua: enderecoViaCep.logradouro ?? "",
    bairro: enderecoViaCep.bairro ?? "",
    cidade: enderecoViaCep.localidade,
    uf: enderecoViaCep.uf,
    estado: enderecoViaCep.estado ?? "",
  };

  enderecosEmCache.set(cepNormalizado, {
    endereco,
    expiraEm: Date.now() + TEMPO_DE_CACHE_MS,
  });

  return { ...endereco };
}
