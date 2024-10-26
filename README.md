 ### Core Digital Banking Microservices 3 - Java com Quarkus, Go com Gin e GraphQL, NestJS com TypeScript e GraphQL 🚀 🔄 🌐

O Core Digital Banking Microservices 3 é uma plataforma modular e escalável composta por vários microserviços, cada um desenvolvido para executar uma tarefa específica dentro do ecossistema digital. Essa solução foi implementada seguindo os princípios da Clean Architecture, garantindo uma separação clara de responsabilidades, manutenção simplificada e extensibilidade do sistema. A comunicação assíncrona entre os microserviços é garantida com RabbitMQ, proporcionando resiliência e desacoplamento das funcionalidades.

#### Microserviços e Tecnologias Utilizadas

1. **comprar-giftcard-microservice (Go, GraphQL, DynamoDB, RabbitMQ, Redis)**
   - **Linguagem**: Go com o framework Gin
   - **Banco de Dados**: DynamoDB para armazenamento de dados de gift cards
   - **Mensageria**: RabbitMQ para filas e processamento assíncrono de compras
   - **Cache**: Redis para otimização de consultas e armazenamento temporário
   - **Funcionalidades**:
     - Compra de Gift Cards: API para compra e geração de códigos de gift cards.
     - Integração de Mensagens: Envio de mensagens de confirmação de compra via RabbitMQ.
     - Resiliência a Falhas: Retry e fallback para garantir que as transações sejam processadas adequadamente.
     - Monitoramento: Coleta de métricas utilizando Prometheus e exposição de dashboards com Grafana.

2. **multas-ipva-microservice (NestJS, GraphQL MongoDB, RabbitMQ, Redis)**
   - **Linguagem**: TypeScript com NestJS
   - **Banco de Dados**: MongoDB para gerenciamento de dados de multas e IPVA
   - **Mensageria**: RabbitMQ para comunicação assíncrona entre serviços
   - **Cache**: Redis para armazenamento de sessões e otimização de acesso
   - **Funcionalidades**:
     - Consulta de Multas e IPVA: Permite consultar dados relacionados a multas de trânsito e impostos.
     - Integração via RabbitMQ: Gerenciamento de eventos de notificações sobre pagamentos pendentes e atualizações em tempo real.
     - Painel Administrativo: Exposição de endpoints para consulta e pagamento de multas.
     - Monitoramento: Coleta de métricas utilizando Prometheus e exposição de dashboards com Grafana.

3. **recarga-celular-microservice (Java, Quarkus, PostgreSQL, RabbitMQ, Redis)**
   - **Linguagem**: Java com Quarkus
   - **Banco de Dados**: PostgreSQL para gerenciamento de recargas
   - **Mensageria**: RabbitMQ para comunicação assíncrona e envio de confirmações de recarga
   - **Cache**: Redis para armazenamento temporário de dados de sessões
   - **Funcionalidades**:
     - Recarga de Celular: Gerenciamento das operações de recarga de crédito para celulares pré-pagos.
     - Notificação de Recarga: Mensagens enviadas após conclusão de recarga através de RabbitMQ.
     - Monitoramento: Coleta de métricas utilizando Prometheus e exposição de dashboards com Grafana.

#### Diagrama da Aplicação

![](https://raw.githubusercontent.com/emersonamorim-dev/CoreBankingMicroservices-CleanArch-3/refs/heads/main/Diagrama/Diagrama-Core-Digital-Banking-Microservice-3.png)

#### Arquitetura
A solução é baseada na Clean Architecture, com uma separação clara em camadas:
- **Domain**: Regras de negócios e modelos principais do sistema.
- **Application**: Casos de uso e a interação entre a camada de domínio e a infraestrutura.
- **Infrastructure**: Módulos responsáveis por integração com bancos de dados, cache, mensageria e monitoramento.
- **Presentation**: Controllers que expõem APIs REST para interação dos microserviços.

#### Monitoramento e Métricas
- **Prometheus e Grafana**: Utilizados para monitorar métricas de desempenho de cada microserviço, possibilitando a visualização dos dados em tempo real através de dashboards.

#### Escalabilidade e Resiliência
- **Escalabilidade**: Cada microserviço pode ser escalado horizontalmente conforme a necessidade utilizando Kubernetes.
- **Resiliência**: RabbitMQ é utilizado para comunicação assíncrona, o que aumenta a tolerância a falhas.

#### Requisitos de Instalação
- Docker e Docker Compose instalados
- RabbitMQ, Redis e bancos de dados respectivos (DynamoDB, MongoDB, PostgreSQL)

#### Passos de Instalação
Clone o repositório do microserviço:
```
git clone https://github.com/emersonamorim-dev/CoreBankingMicroservices-CleanArch-3.git
```
```
cd CoreBankingMicroservices-CleanArch-3
```

#### Mensageria e Cache
RabbitMQ: É utilizado como um message broker, permitindo que os microserviços troquem informações de forma assíncrona. Cada microserviço publica e consome mensagens de filas específicas, garantindo o processamento correto de cada funcionalidade. Redis: Implementado em todos os microserviços como cache de dados críticos, como tokens de autenticação, status de transações e outras operações que exigem alto desempenho. Fluxo de Comunicação A comunicação entre os microserviços é baseada em mensageria com RabbitMQ. Quando uma operação é iniciada, como a emissão de um cartão ou processamento de um pagamento, uma mensagem é publicada em uma fila específica no RabbitMQ. O microserviço apropriado consome a mensagem e processa a operação.

Este modelo de comunicação desacoplada garante resiliência e escalabilidade, permitindo que o sistema continue funcionando mesmo se um dos serviços estiver temporariamente indisponível.


#### Escalabilidade
O Core Digital Banking foi desenvolvido para ser escalável horizontalmente. Usando Kubernetes e Helm, é possível orquestrar os contêineres para ambientes de produção. A escalabilidade é garantida, pois cada microserviço pode ser escalado independentemente, dependendo da carga.

#### Resiliência
A arquitetura poliglota garante que cada microserviço possa ser desenvolvido e mantido em sua própria stack tecnológica, garantindo resiliência e flexibilidade para adotar novas tecnologias conforme necessário.


#### Conclusão

O Core Digital Banking Microservices 3 é uma solução moderna e eficiente para a gestão de serviços digitais, baseada em uma arquitetura poliglota e resiliente. Com a implementação da Clean Architecture, o sistema garante modularidade, manutenção simplificada e alta escalabilidade, sendo capaz de se adaptar a diferentes demandas e ao crescimento do mercado. Utilizando RabbitMQ para comunicação assíncrona, Redis para cache e bancos de dados como DynamoDB, MongoDB e PostgreSQL, o sistema oferece uma base robusta para operações digitais seguras e eficientes.

A independência de cada microserviço e o uso de diferentes stacks tecnológicas permitem que o sistema evolua e integre novas funcionalidades sem impactar outros serviços, proporcionando flexibilidade e inovação. Além disso, o monitoramento e as métricas via Prometheus e Grafana, aliados à escalabilidade fornecida pelo Kubernetes, asseguram que a solução possa lidar com grandes volumes de transações e usuários, mantendo a qualidade e a segurança dos serviços digitais.

### Desenvolvido por:
Emerson Amorim [@emerson-amorim-dev](https://www.linkedin.com/in/emerson-amorim-dev/)

