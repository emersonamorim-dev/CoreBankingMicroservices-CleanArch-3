package services

import (
	"comprar-giftcard-microservice/internal/models"
	"comprar-giftcard-microservice/internal/repository"
	"comprar-giftcard-microservice/pkg/rabbitmq"
	"comprar-giftcard-microservice/pkg/redis"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
)


type GiftCardRequest struct {
	ID             string  `json:"id"`
	UsuarioID      string  `json:"usuario_id"`
	Loja           string  `json:"loja"`
	Valor          float64 `json:"valor"`
	FormaPagamento string  `json:"forma_pagamento"`
	DataHora       string  `json:"data_hora"`
}

func ProcessarCompra(request *GiftCardRequest) error {
	cacheKey := fmt.Sprintf("giftcard_%s", request.UsuarioID)

	if redis.Exists(cacheKey) {
		log.Println("Compra encontrada no cache")
		return nil
	}

	// Cria um objeto GiftCard a partir da requisição
	if request.ID == "" {
		request.ID = uuid.New().String() 
	}
	request.DataHora = time.Now().Format(time.RFC3339)

	giftCard := &models.GiftCard{
		ID:             request.ID,
		UsuarioID:      request.UsuarioID,
		Loja:           request.Loja,
		Valor:          request.Valor,
		FormaPagamento: request.FormaPagamento,
		DataHora:       time.Now(),
	}

	err := repository.InserirCompraDynamoDB(giftCard)
	if err != nil {
		return fmt.Errorf("erro ao inserir compra no DynamoDB: %v", err)
	}

	// Publica a compra no RabbitMQ
	err = rabbitmq.Publish(*request)
	if err != nil {
		return fmt.Errorf("erro ao publicar a compra no RabbitMQ: %v", err)
	}

	redis.Set(cacheKey, *request) 

	log.Println("Compra processada com sucesso")
	return nil
}

// obtém todas as compras do DynamoDB
func ListarCompras() ([]models.GiftCard, error) {
	compras, err := repository.ListarComprasDynamoDB()
	if err != nil {
		return nil, fmt.Errorf("erro ao listar compras do DynamoDB: %v", err)
	}
	return compras, nil
}
