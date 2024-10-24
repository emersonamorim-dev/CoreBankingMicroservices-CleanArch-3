package com.core.infrastructure.cache;

import io.quarkus.redis.datasource.RedisDataSource;
import io.quarkus.redis.datasource.string.StringCommands;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.annotation.PostConstruct;
import jakarta.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class RedisService {

    private static final Logger LOGGER = LoggerFactory.getLogger(RedisService.class);

    @Inject
    RedisDataSource redisDataSource;

    private StringCommands<String, String> stringCommands;

    @PostConstruct
    public void init() {
        try {
            this.stringCommands = redisDataSource.string(String.class);
            LOGGER.info("Conexão com o Redis estabelecida com sucesso.");
        } catch (Exception e) {
            LOGGER.error("Erro ao conectar com o Redis: ", e);
        }
    }

    public void armazenarRecarga(String key, String value) {
        try {
            stringCommands.set(key, value);
            LOGGER.info("Recarga armazenada no Redis com chave: {}", key);
        } catch (Exception e) {
            LOGGER.error("Erro ao armazenar recarga no Redis: ", e);
        }
    }

    public String obterRecarga(String key) {
        try {
            return stringCommands.get(key);
        } catch (Exception e) {
            LOGGER.error("Erro ao obter recarga do Redis: ", e);
            return null;
        }
    }
}
