### Comprar Giftcard Microservice - Golang GIN e GraphQL 🚀 🔄 🌐

Codificação de aplicação em Golang com framework Gin para microserviço de Compra de Giftcards! Esta aplicação foi desenvolvida em **Golang** com uma arquitetura modular e robusta, facilitando a integração de serviços e o crescimento sustentável. O sistema é voltado para o processamento de compra de giftcards, utilizando um ambiente seguro e eficiente. Esta solução visa oferecer uma infraestrutura escalável, resiliente e de fácil manutenção, alinhada com boas práticas de engenharia de software.

##### Tecnologias Utilizadas
- **Golang**: Linguagem principal utilizada no desenvolvimento, escolhida por sua performance e eficiência em aplicações distribuídas.
- **Gin Gonic**: Framework HTTP que proporciona um servidor leve, rápido e ágil, ideal para a construção de APIs REST.
- **GraphQL**: Para permitir consultas flexíveis sobre dados, fornecendo um ponto de integração único para diferentes consultas.
- **Redis**: Utilizado como cache para evitar reprocessamento de compras repetidas, proporcionando uma maior rapidez nas operações.
- **RabbitMQ**: Mensageria utilizada para gerenciar as comunicações assíncronas entre os serviços, garantindo confiabilidade nas transações de compra.
- **AWS DynamoDB**: Banco de dados NoSQL escolhido por sua escalabilidade e por ser uma solução serverless que simplifica o armazenamento de dados.
- **Docker**: Usado para containerização, facilitando o deploy em diferentes ambientes de forma isolada e segura.
- **Prometheus e Grafana**: Monitoramento e visualização de métricas, proporcionando uma visão abrangente da saúde e performance do sistema.

#### Como Funciona a Aplicação
Esta aplicação é responsável por gerenciar as transações de compra de giftcards. Ela possui endpoints REST e GraphQL para realizar operações como comprar um giftcard e listar transações. Abaixo estão os principais fluxos da aplicação.


#### Diagrama da Aplicação

![](https://raw.githubusercontent.com/emersonamorim-dev/CoreBankingMicroservices-CleanArch-3/refs/heads/main/Diagrama/Arquitetura-Comprar-Giftcard-Microservice.png)

#### Rodando aplicação:

- Automatiza aplicação sem precisa rodar os comandos do Docker
```
chmod +x run_app.sh
```

```
./run_app.sh
```

- Comando para buildar Imagem:

```
docker build -t comprar-giftcard-microservice:latest .
```


- Subir Aplicação via container Docker
```
docker-compose up --build
```

#### Realizar a Requisição via Postman


- Requisição Post
```
http://localhost:9081/comprar-giftcard
```

```
{
  "usuario_id": "123456",
  "loja": "Burger King",
  "valor": 500.00,
  "forma_pagamento": "cartao_debito"
}
```


{
    "id": "7988d28d-fa2f-4a34-8491-1889c7f40ae6",
    "message": "Compra realizada com sucesso"
}

#### Realizar a Requisição via Postman
- Requisição Get

```
http://localhost:9081/listar-compras
```

{
    "compras": [
        {
            "id": "gc_123456_1729606117",
            "usuario_id": "123456",
            "loja": "Ifood",
            "valor": 800,
            "data_hora": "2024-10-22T14:08:37Z",
            "forma_pagamento": "cartao_debito"
        },
        {
            "id": "gc_123456_1729606103",
            "usuario_id": "123456",
            "loja": "Uber",
            "valor": 700,
            "data_hora": "2024-10-22T14:08:23Z",
            "forma_pagamento": "cartao_debito"
        },
        {
            "id": "gc_123456_1729606043",
            "usuario_id": "123456",
            "loja": "NetFlix",
            "valor": 500,
            "data_hora": "2024-10-22T14:07:23Z",
            "forma_pagamento": "cartao_debito"
        }
    ]
}


#### Comando para realizar a requisição de Aplicação de forma Sincrona via GraphQL:

- Mutation para criar um Cadastro de compra um Gift Card:

- Acesse via Navegador:
```
http://localhost:9081/graphql
```

```
mutation {
  comprarGiftCard(
    usuario_id: "123456"
    loja: "Amazon"
    valor: 150.50
    forma_pagamento: "CartaoCredito"
  ) {
    id
    usuario_id
    loja
    valor
    data_hora
    forma_pagamento
  }
}
```

- Query para listar compras de Gift Cards:

```
query {
  listarCompras {
    id
    usuario_id
    loja
    valor
    data_hora
    forma_pagamento
  }
}
```


1. **Comprar Giftcard**:
   - O cliente realiza uma requisição (REST ou GraphQL) com os detalhes da compra, como **usuário**, **loja** e **forma de pagamento**.
   - A requisição é validada, e uma checagem é feita no **Redis** para evitar compras duplicadas.
   - Caso seja uma nova compra, o pedido é salvo no **DynamoDB** e um evento é publicado no **RabbitMQ**.
2. **Listar Compras**:
   - Um endpoint para listar todas as compras realizadas é disponível, retornando os dados armazenados no **DynamoDB**.
3. **Caching e Mensageria**:
   - **Redis** é usado para garantir que compras repetidas do mesmo usuário não sejam reprocessadas.
   - **RabbitMQ** é utilizado para propagar os eventos da compra, possibilitando integração com outros serviços que possam processar o pedido, como sistemas de faturamento ou notificações.

#### Arquitetura Usada
A arquitetura desta aplicação segue o padrão de **Clean Architecture**, que separa as responsabilidades em camadas distintas para garantir um código desacoplado e fácil de manter. As principais camadas incluem:

Esta arquitetura foi escolhida para garantir que as regras de negócio possam ser testadas isoladamente das interfaces e dos detalhes da infraestrutura, possibilitando uma maior flexibilidade para alterar tecnologias ou frameworks sem impactar as regras de negócio.

#### Conclusão 
Este microserviço de compra de giftcards demonstra a eficiência de uma solução escalável e resiliente, utilizando tecnologias modernas e robustas, como **Golang**, **RabbitMQ**, **Redis**, e **DynamoDB**. A adoção de **Clean Architecture** e o uso de boas práticas de desenvolvimento garantem um sistema de fácil manutenção e expansão, preparado para demandas futuras e para integração com outros sistemas.

Esta solução é ideal para empresas que buscam alta performance e flexibilidade no gerenciamento de transações digitais, mantendo o foco na escalabilidade e na qualidade do código.


### Desenvolvido por:
Emerson Amorim [@emerson-amorim-dev](https://www.linkedin.com/in/emerson-amorim-dev/)

