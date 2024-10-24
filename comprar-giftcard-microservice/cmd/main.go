package main

import (
	"comprar-giftcard-microservice/internal/controllers"
	graphqlResolver "comprar-giftcard-microservice/internal/graphql"
	"comprar-giftcard-microservice/pkg/prometheus"
	"comprar-giftcard-microservice/pkg/rabbitmq"
	"comprar-giftcard-microservice/pkg/redis"
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-gonic/gin"
	"github.com/graphql-go/graphql"
)

func main() {

	redis.InitializeRedis()

	rabbitmq.InitializeRabbitMQ()

	prometheus.SetupMetrics()

	graphqlResolver.InitSchema()

	router := gin.Default()

	// rotas da API REST
	router.POST("/comprar-giftcard", controllers.ComprarGiftCard)
	router.GET("/listar-compras", controllers.ListarGiftCards)

	// rota para GraphQL
	router.POST("/query", func(c *gin.Context) {
		var params struct {
			Query string `json:"query"`
		}
		if err := c.ShouldBindJSON(&params); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		result := graphql.Do(graphql.Params{
			Schema:        graphqlResolver.Schema,
			RequestString: params.Query,
		})
		if len(result.Errors) > 0 {
			log.Printf("Erro ao executar a query: %v", result.Errors)
		}

		c.JSON(http.StatusOK, result)
	})

	// rota para Playground GraphQL
	router.GET("/graphql", func(c *gin.Context) {
		playground.Handler("GraphQL Playground", "/query").ServeHTTP(c.Writer, c.Request)
	})

	// Roda o servidor na porta 9081
	log.Println("Servidor rodando na porta 9081...")
	if err := router.Run(":9081"); err != nil {
		log.Fatalf("Falha ao iniciar o servidor: %v", err)
	}
}
