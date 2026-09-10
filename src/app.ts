import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";

import enderecoRoutes from "./routes/endereco.routes.ts";
import entregaRoutes from "./routes/entrega.routes.ts";
import {
  CepInvalidoError,
  CepNaoEncontradoError,
  ViaCepIndisponivelError,
} from "./service/viacep.service.ts";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ mensagem: "API de frete em funcionamento" });
});

app.use("/api/enderecos", enderecoRoutes);
app.use("/api/entregas", entregaRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

app.use(
  (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof CepInvalidoError) {
      res.status(400).json({ erro: error.message });
      return;
    }

    if (error instanceof CepNaoEncontradoError) {
      res.status(404).json({ erro: error.message });
      return;
    }

    if (error instanceof ViaCepIndisponivelError) {
      res.status(error.statusCode).json({ erro: error.message });
      return;
    }

    console.error(error);
    res.status(500).json({ erro: "Erro interno do servidor" });
  },
);

export default app;
