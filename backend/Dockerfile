FROM node:20-alpine

WORKDIR /app

# Copiar dependências primeiro (cache layer)
COPY package*.json ./
RUN npm ci --only=production

# Criar pasta de logs
RUN mkdir -p logs

# Copiar código fonte
COPY . .

# Usuário não-root por segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3001

CMD ["node", "src/server.js"]
