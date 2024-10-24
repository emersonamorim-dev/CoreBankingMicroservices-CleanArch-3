package repository

import (
	"comprar-giftcard-microservice/internal/models"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func InserirCompraDynamoDB(request *models.GiftCard) error {
	awsAccessKeyID := os.Getenv("DYNAMODB_ACCESS_KEY_ID")
	awsSecretAccessKey := os.Getenv("DYNAMODB_SECRET_ACCESS_KEY")
	awsRegion := os.Getenv("DYNAMODB_REGION")
	dynamodbEndpoint := os.Getenv("DYNAMODB_ENDPOINT")

	if awsRegion == "" {
		return fmt.Errorf("erro: a região do dynamodb não está configurada corretamente")
	}

	var svc *dynamodb.DynamoDB
	var sess *session.Session
	var err error

	// Tenta conectar ao DynamoDB com retry
	for i := 0; i < 5; i++ {
		sess, err = session.NewSession(&aws.Config{
			Region:      aws.String(awsRegion),
			Endpoint:    aws.String(dynamodbEndpoint),
			Credentials: credentials.NewStaticCredentials(awsAccessKeyID, awsSecretAccessKey, ""),
		})
		if err == nil {
			svc = dynamodb.New(sess)
			break
		}
		log.Printf("tentando conectar ao dynamodb... tentativa %d: %v", i+1, err)
		time.Sleep(5 * time.Second)
	}

	if err != nil {
		return fmt.Errorf("erro ao conectar ao dynamodb após várias tentativas: %v", err)
	}

	err = CriarTabelaDynamoDB(svc)
	if err != nil {
		return err
	}

	// Validação dos campos obrigatórios
	if request.UsuarioID == "" {
		return fmt.Errorf("erro: o campo 'usuario_id' não pode ser vazio")
	}
	if request.Loja == "" {
		return fmt.Errorf("erro: o campo 'loja' não pode ser vazio")
	}
	if request.FormaPagamento == "" {
		return fmt.Errorf("erro: o campo 'forma_pagamento' não pode ser vazio")
	}

	// Gerar um ID único para a compra
	if request.ID == "" {
		request.ID = fmt.Sprintf("gc_%s_%d", request.UsuarioID, time.Now().Unix())
	}
	request.DataHora = time.Now()

	// Insere a compra no DynamoDB
	input := &dynamodb.PutItemInput{
		TableName: aws.String("ComprasGiftCard"),
		Item: map[string]*dynamodb.AttributeValue{
			"ID":             {S: aws.String(request.ID)},
			"UsuarioID":      {S: aws.String(request.UsuarioID)},
			"Loja":           {S: aws.String(request.Loja)},
			"Valor":          {N: aws.String(fmt.Sprintf("%.2f", request.Valor))},
			"DataHora":       {S: aws.String(request.DataHora.Format(time.RFC3339))},
			"FormaPagamento": {S: aws.String(request.FormaPagamento)},
		},
	}

	_, err = svc.PutItem(input)
	if err != nil {
		return fmt.Errorf("erro ao inserir no dynamodb: %v", err)
	}

	log.Println("compra inserida com sucesso no dynamodb")
	return nil
}

func ListarComprasDynamoDB() ([]models.GiftCard, error) {
	awsAccessKeyID := os.Getenv("DYNAMODB_ACCESS_KEY_ID")
	awsSecretAccessKey := os.Getenv("DYNAMODB_SECRET_ACCESS_KEY")
	awsRegion := os.Getenv("DYNAMODB_REGION")
	dynamodbEndpoint := os.Getenv("DYNAMODB_ENDPOINT")

	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String(awsRegion),
		Endpoint:    aws.String(dynamodbEndpoint),
		Credentials: credentials.NewStaticCredentials(awsAccessKeyID, awsSecretAccessKey, ""),
	})
	if err != nil {
		return nil, fmt.Errorf("erro ao conectar ao dynamodb: %v", err)
	}

	svc := dynamodb.New(sess)

	input := &dynamodb.ScanInput{
		TableName: aws.String("ComprasGiftCard"),
	}

	result, err := svc.Scan(input)
	if err != nil {
		return nil, fmt.Errorf("erro ao listar compras: %v", err)
	}

	// Converte o resultado para o tipo de modelo `GiftCard`
	var compras []models.GiftCard
	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, &compras)
	if err != nil {
		return nil, fmt.Errorf("erro ao deserializar compras: %v", err)
	}

	return compras, nil
}

// cria a tabela no DynamoDB se ela não existir
func CriarTabelaDynamoDB(svc *dynamodb.DynamoDB) error {
	input := &dynamodb.CreateTableInput{
		TableName: aws.String("ComprasGiftCard"),
		AttributeDefinitions: []*dynamodb.AttributeDefinition{
			{
				AttributeName: aws.String("ID"),
				AttributeType: aws.String("S"),
			},
		},
		KeySchema: []*dynamodb.KeySchemaElement{
			{
				AttributeName: aws.String("ID"),
				KeyType:       aws.String("HASH"), // Chave primária
			},
		},
		ProvisionedThroughput: &dynamodb.ProvisionedThroughput{
			ReadCapacityUnits:  aws.Int64(5),
			WriteCapacityUnits: aws.Int64(5),
		},
	}

	_, err := svc.CreateTable(input)
	if err != nil {
		if aerr, ok := err.(awserr.Error); ok && aerr.Code() == dynamodb.ErrCodeResourceInUseException {
			log.Println("a tabela já existe, prosseguindo")
			return nil
		}
		return fmt.Errorf("erro ao criar tabela: %v", err)
	}

	log.Println("tabela 'ComprasGiftCard' criada com sucesso")
	return waitForTableToBeActive(svc, "ComprasGiftCard")
}

func waitForTableToBeActive(svc *dynamodb.DynamoDB, tableName string) error {
	for {
		describeTableInput := &dynamodb.DescribeTableInput{
			TableName: aws.String(tableName),
		}

		result, err := svc.DescribeTable(describeTableInput)
		if err != nil {
			return fmt.Errorf("erro ao descrever a tabela: %v", err)
		}

		if *result.Table.TableStatus == dynamodb.TableStatusActive {
			log.Printf("tabela '%s' está ativa", tableName)
			break
		}

		log.Printf("aguardando a tabela '%s' ficar ativa...", tableName)
		time.Sleep(5 * time.Second)
	}

	return nil
}
