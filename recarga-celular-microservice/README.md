
### Recarga Celular Microservice - Java com Quarkus 🚀 🔄 🌐

Codificação de projeto em Java 17 com Quarkus para **Recarga Celular Microservice**, um microserviço desenvolvido para gerenciar recargas de telefones celulares de forma segura e eficiente. Este projeto utiliza tecnologias modernas para criar uma solução escalável e de alta performance, visando atender às demandas de operações bancárias e financeiras, garantindo robustez, escalabilidade e facilidade de integração com outros serviços.

A solução foi projetada para ser ágil, modular e resiliente, aplicando os princípios da Clean Architecture e seguindo as melhores práticas de desenvolvimento e monitoramento.

#### Tecnologias Utilizadas

Este microserviço foi desenvolvido com base em um conjunto poderoso de ferramentas e tecnologias:

- **Java 17**: Linguagem principal de programação utilizada para a construção do microserviço, garantindo estabilidade e desempenho.
- **Quarkus**: Framework Java que proporciona startup rápido e footprint reduzido, otimizando aplicações Java para ambientes nativos em cloud.
- **RabbitMQ**: Message broker utilizado para a gestão de filas, garantindo integração desacoplada entre os componentes do sistema.
- **Redis**: Utilizado como cache para armazenar informações temporárias de recargas recentes, melhorando a latência nas consultas.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenamento persistente das informações de recarga.
- **Prometheus e Grafana**: Monitoramento e visualização de métricas do sistema para garantir uma operação consistente e identificar possíveis problemas em tempo real.
- **Docker**: Contenerização da aplicação para garantir portabilidade e facilitação de deploy em diferentes ambientes.

![Java](https://img.shields.io/badge/-Java-F89820?style=for-the-badge&logo=java&logoColor=white)
![Quarkus](https://img.shields.io/badge/-Quarkus-4695EB?style=for-the-badge&logo=quarkus&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/-RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Maven](https://img.shields.io/badge/-Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)
![Hibernate](https://img.shields.io/badge/-Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

#### Arquitetura


A arquitetura deste microserviço segue os princípios da **Clean Architecture**. Isso significa que as regras de negócio estão isoladas das preocupações de infraestrutura, permitindo uma melhor manutenção, testabilidade e evolutividade do sistema.


- **Camada de Domínio**: Contém as regras de negócio e é independente de qualquer tecnologia ou framework.
- **Camada de Casos de Uso**: Define os serviços que interagem com o domínio, como o caso de uso de realizar recarga, garantindo que toda a lógica de aplicação seja gerenciada aqui.
- **Camada de Infraestrutura**: Fornece os mecanismos de persistência (PostgreSQL), mensageria (RabbitMQ), cache (Redis), entre outros.
- **Camada de Interface**: Inclui os controladores REST que permitem o acesso às funcionalidades oferecidas pelo microserviço.

#### Padrões Utilizados

- **Clean Architecture**: Garantindo independência das regras de negócio em relação às tecnologias.
- **Mensageria com RabbitMQ**: Utilizado para garantir que as requisições sejam processadas de maneira assíncrona, reduzindo o acoplamento entre serviços.
- **Cache com Redis**: O Redis é usado para melhorar o desempenho das consultas, armazenando recargas recentes e evitando acesso desnecessário ao banco de dados.


#### Diagrama da Aplicação

![](https://raw.githubusercontent.com/emersonamorim-dev/CoreBankingMicroservices-CleanArch-3/refs/heads/main/Diagrama/Arquitetura-Recarga-Celular-Microservice.png)



#### Principais Componentes

##### 1. **RecargaService**

Responsável por executar as principais operações relacionadas à recarga, incluindo:
- Verificação no cache se a recarga já foi processada recentemente.
- Execução do caso de uso de recarga.
- Publicação de mensagens no RabbitMQ para notificar outros serviços interessados.
- Registro de métricas usando Prometheus.

##### 2. **RealizarRecargaUseCase**

Contém a lógica de negócio central para validação e processamento de uma nova recarga.

##### 3. **RabbitMQService**

Serviço responsável por se comunicar com o RabbitMQ, permitindo a publicação de mensagens de recarga e gerenciamento da fila de mensagens.

##### 4. **PrometheusMetricas**

Fornece monitoramento de métricas essenciais, como o número de recargas realizadas e o tempo de processamento, que são expostos para o Prometheus e visualizados no Grafana.

#### Como Executar o Projeto

#### Requisitos Pré-requisitos
- **Java 17** ou superior
- **Docker** para execução do ambiente de mensageria e banco de dados
- **Maven** para build da aplicação

### Passos para Execução
1. **Clonar o Repositório**:
   ```sh
   git clone https://github.com/seu-usuario/recarga-celular-microservice.git
   cd recarga-celular-microservice
   ```

2. **Build do Projeto**:

  - Comando para criar o Jar do Projeto
  ```
  mvn clean package -DskipTests
   ```

   - Comoando para fazer o Build do Projeto
   ```
   docker build -t recarga-celular-microservice:latest .
   ```

3. **Executar o Docker Compose**:
   O arquivo `docker-compose.yml` está configurado para levantar os contêineres necessários (RabbitMQ, Redis e PostgreSQL):
   ```sh
   docker-compose up --build
   ```

#### Realizar a Requisição via Postman

- Requisição Post

```
http://localhost:8087/api/recargas

```
#### Corpo Json da Requisição

```
{
  "telefone": "5515999999999",
  "valor": 90.00,
  "metodoPagamento": {
    "tipo": "cartao_credito",
    "detalhes": {
      "numeroCartao": "1811111111111111",
      "nomeTitular": "Emerson Amorim",
      "validade": "12/26",
      "cvv": "123"
    }
  },
  "idTransacao": "e47ac10b-58cc-4372-a567-0e02b2c3d479",
  "operadora": "TIM",
  "dataRecarga": "2024-10-18T23:30:00"
}
```

#### Retorno da Requisição

```
{
    "id": "f2f1e11a-d84f-4bd9-b261-65db53dc2b6d",
    "telefone": "5515999999999",
    "valor": 90.00,
    "operadora": "TIM",
    "metodoPagamento": {
        "id": "80c4b83d-4032-4d50-a3c4-4bd59a939ac3",
        "tipo": "cartao_credito",
        "detalhes": {
            "numeroCartao": "1811111111111111",
            "nomeTitular": "Emerson Amorim",
            "validade": "12/26",
            "cvv": "123"
        }
    },
    "idTransacao": "e47ac10b-58cc-4372-a567-0e02b2c3d479",
    "dataRecarga": "2024-10-18T23:30:00",
    "versao": 0
}
```

#### Para deixar aplicação Down

```
docker-compose down
```


4. **Executar a Aplicação de forma Local**:
   ```sh
   ./mvnw quarkus:dev
   ```

5. **Acessar a Interface REST**:
   A aplicação estará acessível em [http://localhost:8087](http://localhost:8087).

#### Monitoramento e Logs

O sistema utiliza **Prometheus** e **Grafana** para coletar e visualizar as métricas:
- **Prometheus** coleta dados sobre a quantidade de recargas realizadas e tempo de processamento.
- **Grafana** oferece dashboards que ajudam na visualização de desempenho e estabilidade do sistema.

Para acessar o dashboard do Grafana, utilize [http://localhost:3000](http://localhost:3000) e autentique-se usando as credenciais padrão (usuário: `admin`, senha: `admin`).



#### Conclusão

O **Recarga Celular Microservice** é uma solução empresarial robusta, projetada para ser escalável, resiliente e fácil de manter. Utilizando uma arquitetura limpa e tecnologias modernas como **Quarkus**, **Redis**, **RabbitMQ** e ferramentas de monitoramento como **Prometheus** e **Grafana**, o sistema garante alta performance e disponibilidade para o processamento de recargas de celular.

Esta arquitetura permite não apenas um fluxo seguro e confiável de informações, mas também a escalabilidade horizontal dos serviços, alinhando-se às melhores práticas do mercado de software para sistemas financeiros e de telecomunicações.

### Desenvolvido por:
Emerson Amorim [@emerson-amorim-dev](https://www.linkedin.com/in/emerson-amorim-dev/)



