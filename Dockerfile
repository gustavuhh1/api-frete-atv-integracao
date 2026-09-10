# ---- Stage 1: builder ----
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# prisma.config.ts exige DATABASE_URL resolvível so para carregar a config,
# mesmo que "generate" nao conecte de fato ao banco. Valor usado so nesta etapa.
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npx prisma generate
RUN npm run build

# ---- Stage 2: runner ----
FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /usr/src/app/dist ./dist
# swagger-jsdoc le os comentarios @openapi das rotas em tempo de execucao,
# entao o codigo-fonte (nao executado, so lido como texto) precisa estar na imagem.
COPY --from=builder /usr/src/app/src ./src

RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
