package rabbitmq

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/streadway/amqp"
)

var conn *amqp.Connection
var ch *amqp.Channel

func InitializeRabbitMQ() {
	rabbitMQURL := os.Getenv("RABBITMQ_URL")
	if rabbitMQURL == "" {
		rabbitMQURL = "amqp://guest:guest@rabbitmq:5672/"
	}

	var err error
	for i := 0; i < 5; i++ {
		conn, err = amqp.Dial(rabbitMQURL)
		if err == nil {
			break
		}
		log.Printf("Tentando conectar ao RabbitMQ... Tentativa %d", i+1)
		time.Sleep(5 * time.Second)
	}
	if err != nil {
		log.Fatalf("Erro ao conectar no RabbitMQ: %v", err)
	}

	ch, err = conn.Channel()
	if err != nil {
		log.Fatalf("Erro ao abrir canal: %v", err)
	}

	// Declara a exchange
	err = ch.ExchangeDeclare(
		"direct_exchange_comprar_giftcard", // Nome da exchange
		"direct",                           // Tipo da exchange
		true,                               // Durável
		false,                              // AutoDelete
		false,                              // Interno
		false,                              // NoWait
		nil,                                // Argumentos
	)
	if err != nil {
		log.Fatalf("Erro ao declarar a exchange: %v", err)
	}

	// Declara a queue
	_, err = ch.QueueDeclare(
		"fila_giftcard", // Nome da queue
		true,            // Durável
		false,           // AutoDelete
		false,           // Exclusiva
		false,           // NoWait
		nil,             // Argumentos
	)
	if err != nil {
		log.Fatalf("Erro ao declarar a fila: %v", err)
	}

	// Vincula a queue à exchange com a routing key
	err = ch.QueueBind(
		"fila_giftcard",                  // Nome da queue
		"comprar_key",                    // Routing Key
		"direct_exchange_comprar_giftcard", // Nome da exchange
		false,                            // NoWait
		nil,                              // Argumentos
	)
	if err != nil {
		log.Fatalf("Erro ao vincular a fila à exchange: %v", err)
	}
}

func Publish(request interface{}) error {
	body, err := json.Marshal(request)
	if err != nil {
		return err
	}

	// Publica a mensagem na exchange vinculada com a routing key
	err = ch.Publish(
		"direct_exchange_comprar_giftcard", // Nome da exchange
		"comprar_key",                      // Routing Key
		false,
		false,
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
	if err != nil {
		log.Fatalf("Erro ao publicar mensagem: %v", err)
	}
	log.Println("Mensagem publicada com sucesso na fila 'fila_giftcard'")
	return err
}
