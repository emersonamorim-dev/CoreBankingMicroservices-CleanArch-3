package controllers

import (
	"comprar-giftcard-microservice/graph/model"
	"comprar-giftcard-microservice/internal/repository"
	"comprar-giftcard-microservice/internal/services"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func ComprarGiftCard(c *gin.Context) {
	var request services.GiftCardRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dados da requisição inválidos: " + err.Error()})
		return
	}

	// Verifica campos obrigatórios
	if request.UsuarioID == "" || request.Loja == "" || request.FormaPagamento == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "todos os campos são obrigatórios: 'usuario_id', 'loja', 'forma_pagamento'"})
		return
	}

	err := services.ProcessarCompra(&request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Compra realizada com sucesso",
		"id":      request.ID,
	})
}

// Endpoint listar compras
func ListarGiftCards(c *gin.Context) {
	compras, err := repository.ListarComprasDynamoDB()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"compras": compras})
}

func ListarGiftCardsGraphQL() ([]*model.GiftCard, error) {
    compras, err := repository.ListarComprasDynamoDB()
    if err != nil {
        log.Printf("Erro ao listar compras: %v", err)
        return nil, err
    }

    // Converte o resultado para o modelo GraphQL
    var giftCards []*model.GiftCard
    for _, compra := range compras {
        giftCard := &model.GiftCard{
            ID:             compra.ID,
            UsuarioID:      compra.UsuarioID,
            Loja:           compra.Loja,
            Valor:          compra.Valor,
            DataHora:       compra.DataHora.Format(time.RFC3339), 
            FormaPagamento: compra.FormaPagamento,
        }
        giftCards = append(giftCards, giftCard)
    }

    return giftCards, nil
}
