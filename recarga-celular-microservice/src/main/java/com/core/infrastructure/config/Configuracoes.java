package com.core.infrastructure.config;

import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class Configuracoes {

    // Configurações de RabbitMQ (usando a configuração padrão de SmallRye)
    @ConfigProperty(name = "mp.messaging.outgoing.recarga-exchange.host")
    String rabbitMqHost;

    @ConfigProperty(name = "mp.messaging.outgoing.recarga-exchange.username")
    String rabbitMqUsername;

    @ConfigProperty(name = "mp.messaging.outgoing.recarga-exchange.password")
    String rabbitMqPassword;

    @ConfigProperty(name = "mp.messaging.outgoing.recarga-exchange.address")
    String rabbitMqExchange;

    // Configurações de banco de dados PostgreSQL
    @ConfigProperty(name = "quarkus.datasource.jdbc.url")
    String jdbcUrl;

    @ConfigProperty(name = "quarkus.datasource.username")
    String jdbcUsername;

    @ConfigProperty(name = "quarkus.datasource.password")
    String jdbcPassword;

    // Configurações de Redis
    @ConfigProperty(name = "quarkus.redis.hosts")
    String redisHosts;

    // Configurações de cache de recarga (em minutos)
    @ConfigProperty(name = "cache.recarga.expiration.minutes", defaultValue = "10")
    int cacheExpirationMinutes;

    public String getRabbitMqHost() {
        return rabbitMqHost;
    }

    public String getRabbitMqUsername() {
        return rabbitMqUsername;
    }

    public String getRabbitMqPassword() {
        return rabbitMqPassword;
    }

    public String getRabbitMqExchange() {
        return rabbitMqExchange;
    }

    public String getJdbcUrl() {
        return jdbcUrl;
    }

    public String getJdbcUsername() {
        return jdbcUsername;
    }

    public String getJdbcPassword() {
        return jdbcPassword;
    }

    public String getRedisHosts() {
        return redisHosts;
    }

    public int getCacheExpirationMinutes() {
        return cacheExpirationMinutes;
    }
}
