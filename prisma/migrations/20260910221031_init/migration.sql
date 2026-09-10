-- CreateEnum
CREATE TYPE "StatusEntrega" AS ENUM ('PENDENTE', 'EM_TRAFEGO', 'ENTREGUE', 'CANCELADO');

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "importado" BOOLEAN NOT NULL DEFAULT false,
    "categoria" TEXT NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrega" (
    "id" SERIAL NOT NULL,
    "cepDestino" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "complemento" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "tipoResidencia" TEXT NOT NULL,
    "cepOrigem" TEXT NOT NULL,
    "distancia" DOUBLE PRECISION NOT NULL,
    "taxaImposto" DOUBLE PRECISION NOT NULL,
    "taxaFrete" DOUBLE PRECISION NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "status" "StatusEntrega" NOT NULL DEFAULT 'PENDENTE',
    "remetente" TEXT NOT NULL,
    "destinatario" TEXT NOT NULL,

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
