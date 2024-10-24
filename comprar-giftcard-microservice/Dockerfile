FROM golang:1.22.5-alpine AS build

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o go.mod e go.sum separadamente para o cache das dependências
COPY go.mod go.sum ./

# Baixar as dependências do Go
RUN go mod download

# Copiar o código fonte
COPY . .

# Construir o binário da aplicação
RUN go build -o comprar-giftcard-microservice ./cmd/main.go

# Etapa de produção final, usando uma imagem mais leve
FROM alpine:3.18

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o binário da etapa de build
COPY --from=build /app/comprar-giftcard-microservice /app/comprar-giftcard-microservice

# Expor a porta que o serviço vai usar
EXPOSE 9081

# Comando para rodar a aplicação
CMD ["/app/comprar-giftcard-microservice"]

