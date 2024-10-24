FROM maven:3.8-openjdk-17-slim AS build

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Copiar o arquivo pom.xml e baixar as dependências do Maven
COPY pom.xml ./
RUN mvn dependency:go-offline

# Copiar o código-fonte para o container
COPY src ./src

# Compilar o projeto e criar o JAR completo (uber-jar)
RUN mvn clean package -DskipTests

# Etapa de execução usando OpenJDK 17
FROM openjdk:17-jdk-slim

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar o conteúdo gerado do Quarkus
COPY --from=build /usr/src/app/target/quarkus-app/lib/ /app/lib
COPY --from=build /usr/src/app/target/quarkus-app/*.jar /app/
COPY --from=build /usr/src/app/target/quarkus-app/app/ /app/app/
COPY --from=build /usr/src/app/target/quarkus-app/quarkus/ /app/quarkus/

# Expor a porta na qual o Quarkus está rodando
EXPOSE 8087

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "/app/quarkus-run.jar"]
