package model

type GiftCard struct {
    ID             string  `json:"id" dynamodbav:"ID"`
    UsuarioID      string  `json:"usuario_id" dynamodbav:"UsuarioID"`
    Loja           string  `json:"loja" dynamodbav:"Loja"`
    Valor          float64 `json:"valor" dynamodbav:"Valor"`
    DataHora       string  `json:"data_hora" dynamodbav:"DataHora"`
    FormaPagamento string  `json:"forma_pagamento" dynamodbav:"FormaPagamento"`
}


type Mutation struct {
}

type NewGiftCard struct {
	UsuarioID      string  `json:"usuarioID"`
	Loja           string  `json:"loja"`
	Valor          float64 `json:"valor"`
	FormaPagamento string  `json:"formaPagamento"`
}

type Query struct {
}
