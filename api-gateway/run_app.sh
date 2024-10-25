#!/bin/bash

# Parar script em caso de erro
set -e

# Mensagem de início
echo "Iniciando a configuração do projeto Docker..."

# Verificar se o Docker está instalado
if ! [ -x "$(command -v docker)" ]; then
  echo 'Erro: Docker não está instalado.' >&2
  exit 1
fi

# Verificar se o Docker Compose está instalado
if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Erro: Docker Compose não está instalado.' >&2
  exit 1
fi

# Construir a imagem Docker
echo "Construindo a imagem Docker..."
docker build -t api-gateway .

# Subir os serviços com Docker Compose
echo "Subindo os containers com Docker Compose..."
docker-compose up --build

# Mensagem de sucesso
echo "Aplicação rodando com sucesso!"
