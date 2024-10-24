FROM node:20-alpine AS builder

# Defina o diretório de trabalho
WORKDIR /app

# Copie apenas os arquivos de dependência (package.json e package-lock.json ou yarn.lock)
COPY package*.json ./

# Instale as dependências da aplicação e o NestJS CLI localmente (sem salvar nas dependências do projeto)
RUN npm install --legacy-peer-deps
RUN npm install @nestjs/cli

# Copie o restante dos arquivos do projeto
COPY . .

# Garanta que o diretório tenha as permissões adequadas
RUN chmod -R 755 /app

# Compile a aplicação NestJS usando o CLI instalado localmente
RUN npm run build

# Etapa 2: Produção
FROM node:20-alpine AS production

# Defina a variável de ambiente NODE_ENV para produção
ENV NODE_ENV=production

# Defina o diretório de trabalho para a aplicação
WORKDIR /app

# Copie as dependências instaladas da etapa anterior
COPY --from=builder /app/node_modules ./node_modules

# Copie a build da aplicação NestJS
COPY --from=builder /app/dist ./dist

# Copie o arquivo de configuração (se necessário, ajuste conforme o ambiente)
COPY --from=builder /app/.env ./.env

# Garanta que o diretório de produção também tenha as permissões adequadas
RUN chmod -R 755 /app

# Exponha a porta usada pelo NestJS (padrão 3000 ou personalizada)
EXPOSE 8018

# Defina o comando de inicialização da aplicação
CMD ["node", "dist/main"]
