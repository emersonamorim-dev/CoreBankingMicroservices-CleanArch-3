package redis

import (
	"context"
	"log"
	"os"

	"github.com/go-redis/redis/v8"
)

var client *redis.Client
var ctx = context.Background()

func InitializeRedis() {
	// Obtém o endereço e a porta do Redis da variável de ambiente
	redisHost := os.Getenv("REDIS_HOST")
	if redisHost == "" {
		redisHost = "redis:6379"  
	}

	client = redis.NewClient(&redis.Options{
		Addr: redisHost,
	})

	_, err := client.Ping(ctx).Result()
	if err != nil {
		log.Fatalf("Erro ao conectar no Redis: %v", err)
	}
}

func Set(key string, value interface{}) {
	client.Set(ctx, key, value, 0)
}

func Exists(key string) bool {
	val, err := client.Exists(ctx, key).Result()
	return err == nil && val > 0
}
