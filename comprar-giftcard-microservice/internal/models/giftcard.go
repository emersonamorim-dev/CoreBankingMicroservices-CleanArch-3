package models

import (
	"time"
)

type GiftCard struct {
	ID            string    `json:"id" dynamodbav:"ID"`
	UsuarioID     string    `json:"usuario_id" dynamodbav:"UsuarioID"`
	Loja          string    `json:"loja" dynamodbav:"Loja"`
	Valor         float64   `json:"valor" dynamodbav:"Valor"`
	DataHora      time.Time `json:"data_hora" dynamodbav:"DataHora"`
	FormaPagamento string   `json:"forma_pagamento" dynamodbav:"FormaPagamento"` 
}
