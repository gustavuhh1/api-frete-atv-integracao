import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "API Frete",
      version: "1.0.0",
      description:
        "API para gestao de produtos e entregas, com calculo automatico de " +
        "distancia, imposto e frete a partir de dados reais de CEP (ViaCEP).",
    },
    servers: [{ url: "/", description: "Servidor atual" }],
    tags: [
      { name: "Status", description: "Verificacao de disponibilidade da API" },
      { name: "Produtos", description: "Cadastro de produtos" },
      { name: "Entregas", description: "Criacao e acompanhamento de entregas" },
      { name: "Enderecos", description: "Consulta de enderecos via ViaCEP" },
    ],
    components: {
      schemas: {
        Produto: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            nome: { type: "string", example: "Fone de ouvido bluetooth" },
            descricao: { type: "string", example: "Fone sem fio com cancelamento de ruido" },
            preco: { type: "number", format: "float", example: 199.9 },
            quantidade: { type: "integer", example: 50 },
            peso: { type: "number", format: "float", example: 0.3 },
            importado: { type: "boolean", example: false },
            categoria: { type: "string", example: "eletronicos" },
          },
        },
        ProdutoInput: {
          type: "object",
          required: ["nome", "descricao", "preco", "quantidade", "peso", "categoria"],
          properties: {
            nome: { type: "string", example: "Fone de ouvido bluetooth" },
            descricao: { type: "string", example: "Fone sem fio com cancelamento de ruido" },
            preco: { type: "number", format: "float", example: 199.9 },
            quantidade: { type: "integer", example: 50 },
            peso: { type: "number", format: "float", example: 0.3 },
            importado: { type: "boolean", example: false, default: false },
            categoria: { type: "string", example: "eletronicos" },
          },
        },
        Entrega: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            cepOrigem: { type: "string", example: "01001000" },
            cepDestino: { type: "string", example: "20040020" },
            rua: { type: "string", example: "Praca Maua" },
            bairro: { type: "string", example: "Centro" },
            cidade: { type: "string", example: "Rio de Janeiro" },
            uf: { type: "string", example: "RJ" },
            estado: { type: "string", example: "Rio de Janeiro" },
            complemento: { type: "string", example: "Apto 101" },
            numero: { type: "string", example: "10" },
            tipoResidencia: { type: "string", example: "casa" },
            distancia: { type: "number", format: "float", example: 300 },
            taxaImposto: { type: "number", format: "float", example: 5 },
            taxaFrete: { type: "number", format: "float", example: 120 },
            produtoId: { type: "integer", example: 1 },
            produto: { $ref: "#/components/schemas/Produto" },
            status: { $ref: "#/components/schemas/StatusEntrega" },
            remetente: { type: "string", example: "Loja XPTO" },
            destinatario: { type: "string", example: "Joao da Silva" },
          },
        },
        EntregaInput: {
          type: "object",
          required: [
            "produtoId",
            "cepOrigem",
            "cepDestino",
            "remetente",
            "destinatario",
            "numero",
            "complemento",
            "tipoResidencia",
          ],
          properties: {
            produtoId: { type: "integer", example: 1 },
            cepOrigem: { type: "string", example: "01001000" },
            cepDestino: { type: "string", example: "20040020" },
            remetente: { type: "string", example: "Loja XPTO" },
            destinatario: { type: "string", example: "Joao da Silva" },
            numero: { type: "string", example: "10" },
            complemento: { type: "string", example: "Apto 101" },
            tipoResidencia: { type: "string", example: "casa" },
          },
        },
        StatusEntrega: {
          type: "string",
          enum: ["PENDENTE", "EM_TRAFEGO", "ENTREGUE", "CANCELADO"],
          example: "PENDENTE",
        },
        SimularFreteInput: {
          type: "object",
          required: ["cepOrigem", "cepDestino", "peso"],
          properties: {
            cepOrigem: { type: "string", example: "01001000" },
            cepDestino: { type: "string", example: "20040020" },
            peso: { type: "number", format: "float", example: 2.5 },
          },
        },
        SimularFreteResultado: {
          type: "object",
          properties: {
            taxaFrete: { type: "number", format: "float", example: 120 },
            taxaImposto: { type: "number", format: "float", example: 5 },
            distancia: { type: "number", format: "float", example: 300 },
          },
        },
        Endereco: {
          type: "object",
          properties: {
            cep: { type: "string", example: "01001000" },
            rua: { type: "string", example: "Praca da Se" },
            bairro: { type: "string", example: "Se" },
            cidade: { type: "string", example: "Sao Paulo" },
            uf: { type: "string", example: "SP" },
            estado: { type: "string", example: "Sao Paulo" },
          },
        },
        ErroErro: {
          type: "object",
          description: "Formato de erro usado pelas rotas de produtos e entregas.",
          properties: {
            error: { type: "string", example: "Produto não encontrado." },
          },
        },
        ErroErroPt: {
          type: "object",
          description: "Formato de erro usado pelo handler global e pela rota de enderecos.",
          properties: {
            erro: { type: "string", example: "Rota não encontrada" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/app.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
