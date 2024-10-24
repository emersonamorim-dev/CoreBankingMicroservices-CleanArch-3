package graphql

import (
	"comprar-giftcard-microservice/internal/services"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/graphql-go/graphql"
)

var GiftCardType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "GiftCard",
		Fields: graphql.Fields{
			"id":             &graphql.Field{Type: graphql.String},
			"usuario_id":     &graphql.Field{Type: graphql.String},
			"loja":           &graphql.Field{Type: graphql.String},
			"valor":          &graphql.Field{Type: graphql.Float},
			"data_hora":      &graphql.Field{Type: graphql.String},
			"forma_pagamento": &graphql.Field{Type: graphql.String},
		},
	},
)

var Schema graphql.Schema

func InitSchema() {
	schemaConfig := graphql.SchemaConfig{
		Query: graphql.NewObject(
			graphql.ObjectConfig{
				Name: "Query",
				Fields: graphql.Fields{
					"listarCompras": &graphql.Field{
						Type: graphql.NewList(GiftCardType),
						Resolve: func(params graphql.ResolveParams) (interface{}, error) {
							// Obtendo a lista de compras
							compras, err := services.ListarCompras()
							if err != nil {
								return nil, fmt.Errorf("erro ao listar compras: %v", err)
							}
							return compras, nil
						},
					},
				},
			},
		),
		Mutation: graphql.NewObject(
			graphql.ObjectConfig{
				Name: "Mutation",
				Fields: graphql.Fields{
					"comprarGiftCard": &graphql.Field{
						Type: GiftCardType,
						Args: graphql.FieldConfigArgument{
							"usuario_id":      &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
							"loja":            &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
							"valor":           &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.Float)},
							"forma_pagamento": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
						},
						Resolve: func(params graphql.ResolveParams) (interface{}, error) {
							request := &services.GiftCardRequest{
								ID:             uuid.New().String(),
								UsuarioID:      params.Args["usuario_id"].(string),
								Loja:           params.Args["loja"].(string),
								Valor:          params.Args["valor"].(float64),
								FormaPagamento: params.Args["forma_pagamento"].(string),
								DataHora:       time.Now().Format(time.RFC3339),
							}

							err := services.ProcessarCompra(request)
							if err != nil {
								return nil, fmt.Errorf("erro ao processar compra: %v", err)
							}

							return map[string]interface{}{
								"id":             request.ID,
								"usuario_id":     request.UsuarioID,
								"loja":           request.Loja,
								"valor":          request.Valor,
								"data_hora":      request.DataHora,
								"forma_pagamento": request.FormaPagamento,
							}, nil
						},
					},
				},
			},
		),
	}

	var err error
	Schema, err = graphql.NewSchema(schemaConfig)
	if err != nil {
		log.Fatalf("Falha ao criar o schema GraphQL: %v", err)
	}
}
