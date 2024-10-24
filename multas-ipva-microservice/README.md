### Multas-IPVA-Microservice - NestJS, Typescript e GraphQL 🚀 🔄 🌐

Codificação de aplicação para Microserviço Multas-IPVA-Microservice usando framework NestJS com TypeScript, uso de GraphQL como protocolo para chamadas síncronas e uso de RabbitMQ para comunicação assíncrona do Microserviço é uma solução moderna e escalável para a gestão de consultas de multas e IPVA de veículos. Implementei usando o banco de dados MongoDB, que facilita a escalabilidade da aplicação, com uso de Prometheus e Grafana para monitoramento de métricas e Redis para fazer cache em memória da aplicação. Este sistema é construído como um conjunto de microserviços, cada um dedicado a funcionalidades específicas, garantindo modularidade, resiliência e facilidade de manutenção. O principal objetivo é oferecer uma API eficiente e segura para integrar com outros sistemas, possibilitando consultas rápidas e precisas de informações relacionadas a multas e IPVA.


#### Tecnologias Utilizadas

A solução foi desenvolvida utilizando um conjunto de tecnologias de ponta, projetadas para garantir alta disponibilidade e performance. As tecnologias incluem:

- **Node.js/NestJS**: O framework principal utilizado para construir os microserviços, proporcionando uma arquitetura modular e escalável.
- **Redis**: Utilizado para caching, melhorando a performance e reduzindo a latência nas consultas recorrentes.
- **RabbitMQ**: Implementado para comunicação assíncrona entre microserviços, garantindo resiliência e escalabilidade.
- **GraphQL**: Utilizado como a camada de API, oferecendo consultas eficientes e flexíveis, permitindo que os clientes obtenham exatamente os dados de que precisam.
- **MongoDB**: Banco de dados NoSQL utilizado para armazenar as informações de multas e IPVA, devido à sua capacidade de escalar horizontalmente e gerenciar grandes volumes de dados.
- **Docker**: Containerização dos microserviços para facilitar o deploy, consistência no ambiente de execução e orquestração.
- **Prometheus & Grafana**: Ferramentas para monitoramento e visualização de métricas, ajudando a garantir a saúde dos microserviços e a identificar possíveis gargalos.

## Arquitetura da Solução

A arquitetura desta aplicação segue o padrão **Microservices**, onde cada funcionalidade principal é implementada em um serviço isolado e autônomo. A comunicação entre os microserviços é feita de forma assíncrona, utilizando o **RabbitMQ** para garantir a entrega das mensagens mesmo em situações de falha temporária de algum componente.

A aplicação é composta pelos seguintes componentes principais:

1. **API Gateway**: Responsável por receber as requisições dos clientes e direcionar para os microserviços apropriados. Este componente também lida com autenticação e autorização.
2. **Multas-IPVA-Microservice**: Microserviço responsável por gerenciar as informações de multas e IPVA dos veículos, bem como responder a consultas através da API GraphQL.
3. **Cache Service (Redis)**: Utilizado para armazenar informações de consulta em cache, permitindo respostas rápidas para consultas repetidas.
4. **Serviço de Mensageria (RabbitMQ)**: Facilita a comunicação entre os microserviços, garantindo que as mensagens de eventos sejam entregues corretamente.
5. **Banco de Dados (MongoDB)**: Armazena as informações de veículos, multas, IPVA e históricos de consultas, proporcionando persistência durável e flexível.

A arquitetura é projetada para ser altamente escalável e tolerante a falhas. Cada microserviço pode ser escalado independentemente, de acordo com as demandas de carga, garantindo que a solução se adapte bem ao crescimento do tráfego e ao aumento no número de usuários.

#### Como Funciona o Microserviço Multas-IPVA-Microservice

O **Multas-IPVA-Microservice** é um dos principais microserviços desta aplicação. Ele foi desenvolvido com **NestJS** e segue os princípios de **Clean Architecture** para garantir separação de responsabilidades e facilitar a manutenção e evolução do código.


#### Diagrama da Aplicação

![](https://raw.githubusercontent.com/emersonamorim-dev/CoreBankingMicroservices-CleanArch-3/refs/heads/main/Diagrama/Arquitetura-Multas-IPVA-Microservice.png)


##### Clone o repositório do microserviço:
```
git clone https://github.com/emersonamorim-dev/CoreBankingMicroservices-CleanArch-3.git
```
```
cd CoreBankingMicroservices-CleanArch-3
```

### Aplicação está toda configurada para subir Via Docker Desktop no Windows dentro do WSL2 com Ubuntu 24.04

#### Configure seu usuário do WSL2 ou Ubuntu no docker-compose.yml em:

```
build: /home/seu-usuario/corebankingmicroservices-cleanarch-3/multas-ipva-microservice/
```


#### Comandos para rodar aplicação:


- Comando para instalar o GraphQL:

```
npm install @nestjs/graphql graphql-tools graphql
```

- Instalar as dependências do GraphQL:
```
npm install @nestjs/graphql @nestjs/apollo apollo-server-express graphql-tools graphql

```


- Comando para instalar o suporte ao RabbitMQ:

```
npm install --save @nestjs/microservices amqplib
```


Comando para instalar o MongoDB no NestJS:

```
npm install @nestjs/mongoose mongoose

```

- Comando para instalar o suporte a Prometheus no NestJS:

```
npm install @willsoto/nestjs-prometheus

```

```
npm install @willsoto/nestjs-prometheus prom-client
```

ou

- Adicionar o prom-client ao seu projeto:

```
npm install prom-client

```

Instalar o @nestjs/config e as dependências necessárias:

```
npm install @nestjs/config

```

Certifique-se de que o @types/joi está instalado (se estiver usando validação com Joi):

```
npm install joi @types/joi
```

ou
```
npm install joi
```
```
npm install @types/joi --save-dev
```


- Comando para Instalar o ioredis e o @nestjs/redis

```
npm install ioredis @nestjs/redis
```

ou
```
npm install ioredis
```


- Instalar helmet e express-rate-limit estejam corretamente instalados e funcionais na sua aplicação,

```
npm install helmet express-rate-limit
```


- Instalar Dependências do Projeto

```
npm install
```

- Comando para instalar o NestJS de forma Global:
```
npm install -g @nestjs/cli
```


Caso o Node.js na versão 20 não esteja instalado, você pode instalá-lo com os seguintes comandos (Ubuntu):

```
sudo apt update
```
```
sudo apt install nodejs
```
```
sudo apt install npm
```


- Comando para instalar todas Dependências principais para rodar aplicação:
Execute os seguintes comandos para instalar as dependências:
```
npm install @nestjs/graphql graphql-tools graphql @nestjs/mongoose mongoose @nestjs/microservices amqplib @nestjs/redis ioredis @willsoto/nestjs-prometheus
```

- Configure as Variáveis de ambiente no seu arquivo .env


- Comando para mudar permissão do Mongo DB:
```
sudo chmod -R 755 databases/mongo/data
```



#### Comando para buildar Imagem:

``` 
docker build -t multas-ipva-microservice:latest .
``` 


#### Subir Aplicação via Docker

``` 
docker-compose up --build

```


#### Realizar a Requisição via Postman

- Requisição Post para cadastrar Veículo no Sistema

```
http://localhost:8018/veiculos

```

#### Corpo Json da Requisição

```
{
  "placa": "ELA1881",
  "multas": 500,
  "ipva": 800,
  "idProprietario": "1834567890" 
}
```

#### Retorno da Requisição

```
{
    "status": 200,
    "data": {
        "placa": "ELA1881",
        "multas": 500,
        "ipva": 800,
        "idProprietario": "1834567890",
        "dividaTotal": 1300
    }
}
```


- Requisição Post para Consulta de Parcela Veículo no Sistema

```
http://localhost:8018/veiculos/ELA1881/parcelar

```


#### Corpo Json da Requisição

```
{
  "numeroParcelas": 12
}

```

#### Retorno da Requisição

```
{
    "status": 200,
    "data": {
        "placa": "ELA1881",
        "dividaTotal": 1000,
        "numeroParcelas": 12,
        "valorParcela": 83.33,
        "formasPagamento": [
            "Cartão de Crédito",
            "Cartão de Débito",
            "Boleto",
            "Pix"
        ]
    }
}
```

- Requisição Get para Consultar Veículo no Sistema

```
http://localhost:8018/veiculos/ELA1881

```


#### Retorno da Requisição

```
{
    "status": 200,
    "data": {
        "placa": "ELA1881",
        "multas": 200,
        "ipva": 800,
        "idProprietario": "1834567890"
    }
}
```


- Requisição Get para Número Consulta do Veículo no Sistema

```
http://localhost:8018/veiculos/ELA1881/consultas

```


#### Retorno da Requisição

```
{
    "status": 200,
    "data": {
        "placa": "ELA1881",
        "numeroConsultas": 1
    }
}
```


#### Fazer Requisição via GraphQL

- Acessar nesse endereço:

```
http://localhost:8018/graphql
```

- Fazer uma chamada via Query:

```
query {
  consultarDividaVeiculo(placa: "ELA1881") {
    placa
    multas
    ipva
    dividaTotal
  }
}
```

- Fazer uma chamada via Mutation:

```
mutation {
  parcelarDivida(placa: "ELA1881", numeroParcelas: 12) {
    placa
    dividaTotal
    numeroParcelas
    valorParcela
    formasPagamento
  }
}
```


- Fazer uma chamada via Query:

```
query {
  obterNumeroConsultas(placa: "ABC1234")
}
```

#### Print do GraphQL funcional

![](https://raw.githubusercontent.com/emersonamorim-dev/CoreBankingMicroservices-CleanArch-3/refs/heads/main/Diagrama/Captura-tela-2024-10-21-154020.png)

#### Print do GraphQL funcional
![](https://raw.githubusercontent.com/emersonamorim-dev/CoreBankingMicroservices-CleanArch-3/refs/heads/main/Diagrama/Captura-tela-2024-10-21-154100.png)

#### Print do GraphQL funcional
![](https://raw.githubusercontent.com/emersonamorim-dev/CoreBankingMicroservices-CleanArch-3/refs/heads/main/Diagrama/Captura-tela-2024-10-21-154148.png)


#### Comando para rodar os Testes em Jest

```
npm run test
```


#### Debugando Variáveis de Ambiente (opcional)
Se o problema persistir, você pode verificar quais variáveis de ambiente estão disponíveis dentro do container executando o comando:

```
docker-compose exec multas-ipva-app env
```


#### Principais Funcionalidades:

1. **Consulta de Multas**: Recebe requisições para consultar multas associadas a um determinado veículo. As consultas são realizadas no banco de dados MongoDB, utilizando caching para otimizar as respostas.
2. **Consulta de IPVA**: Permite que os usuários verifiquem o status do IPVA de um veículo específico, com informações detalhadas sobre valores devidos, datas de vencimento, entre outros.
3. **Comunicação Assíncrona**: Utilizando o **RabbitMQ**, o microserviço recebe eventos de outros serviços que possam influenciar as multas ou IPVA, como notificações de pagamento ou mudanças no status de registro do veículo.
4. **API GraphQL**: Oferece uma interface flexível e rica para os clientes realizarem consultas complexas, permitindo que os usuários obtenham exatamente os dados que necessitam, sem sobrecarga.
5. **Monitoramento e Logs**: O microserviço conta com integração ao **Prometheus** e ao **Grafana** para monitoramento em tempo real, além de registrar logs detalhados de todas as operações e erros para diagnóstico rápido.

Este microserviço foi desenhado para ser **resiliente** e **escalável**, garantindo que mesmo em momentos de alto volume de consultas, o desempenho da aplicação se mantenha estável e eficiente.

#### Conclusão

Esta aplicação exemplifica uma solução empresarial robusta e escalável para a gestão de multas e IPVA de veículos, baseada em uma arquitetura de microserviços e utilizando tecnologias modernas e amplamente adotadas no mercado. Com a implementação de mecanismos de caching, mensageria e monitoramento, a aplicação é capaz de oferecer uma experiência ágil e confiável aos usuários finais.

A arquitetura baseada em microserviços permite que cada componente seja desenvolvido, testado e implantado de forma independente, garantindo uma capacidade contínua de evolução e manutenção. O uso de práticas modernas como o **Clean Architecture** e a containerização com **Docker** facilita a colaboração entre equipes, aumenta a produtividade dos desenvolvedores e garante um ambiente de execução consistente em todas as fases do ciclo de vida do software.

Este sistema foi desenvolvido visando flexibilidade e desempenho, sendo ideal para integrar com outros sistemas empresariais que requerem acesso a informações de multas e IPVA de maneira eficiente e segura. A aplicação está preparada para escalar de acordo com as necessidades do negócio, sendo capaz de atender desde pequenos volumes até demandas complexas e de grande escala com alta performance e confiabilidade.

### Desenvolvido por:
Emerson Amorim [@emerson-amorim-dev](https://www.linkedin.com/in/emerson-amorim-dev/)



